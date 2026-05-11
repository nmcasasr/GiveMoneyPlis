#!/usr/bin/env python3
"""
Y-Zipper Design Tool — Python Implementation
Reference: "Y-zipper: 3D Printing Flexible–Rigid Transition Mechanism for
           Rapid and Reversible Assembly" (CHI 2026, MIT CSAIL)
GitHub:    https://github.com/CassiusXiang/Y-Zipper-Design-Tool

Architecture
────────────
A Y-Zipper strip is a 1-D chain of rigid *modules* joined by thin compliant
*bridges*.  Three such strips, arranged at 120° to each other, interlock to
form a rigid triangular-prism rod.  The bridge thickness (0.8 mm default)
controls flexibility; the solid module blocks provide stiffness when zipped.

This script reproduces the four motion primitives described in the paper:
  straight  – linear rod along Z
  bent      – planar arc (arch)
  coiled    – 3-D helix (spring)
  twisted   – straight spine with rotating cross-section
"""

from __future__ import annotations
import os, json
import numpy as np
from numpy import sin, cos, pi, sqrt
import trimesh
import trimesh.creation as tc
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D          # noqa: F401 (registers 3d)
from mpl_toolkits.mplot3d.art3d import Poly3DCollection

# ── output directory ──────────────────────────────────────────────────────────
OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ── geometric parameters (all in mm) ─────────────────────────────────────────
BRIDGE_THICK = 0.8    # compliant bridge thickness – TPU-friendly
STRIP_LEN    = 100.0  # target arc-length of each strip
MOD_W        = 8.0    # module width  (lateral / Z-axis of local frame)
MOD_H        = 3.5    # module height (normal / Y-axis of local frame)
MOD_L        = 3.2    # module length (axial  / X-axis of local frame)
BRIDGE_L     = 0.8    # bridge axial length
PITCH        = MOD_L + BRIDGE_L          # 4.0 mm per module+bridge unit
N_MOD        = max(2, int(round(STRIP_LEN / PITCH)))  # 25 modules

# interlocking tab on the lateral edge of each module
TAB_H = 1.5          # tab protrusion height
TAB_W = 2.8          # tab width along strip axis
TAB_D = MOD_H * 0.55 # tab depth (fraction of module height)


# ── frame utilities ───────────────────────────────────────────────────────────

def _stable_frame(
    tangent: np.ndarray,
    prev_normal: np.ndarray | None = None,
) -> tuple[np.ndarray, np.ndarray, np.ndarray]:
    """
    Return an orthonormal frame (t, n, b) consistent with the previous frame.
    Uses parallel transport: re-orthogonalise prev_normal against new tangent.
    Falls back to a world-up reference when no previous normal is available.
    """
    t = np.asarray(tangent, dtype=float)
    t /= np.linalg.norm(t)

    if prev_normal is not None:
        n0 = np.asarray(prev_normal, dtype=float)
        n0 = n0 - np.dot(n0, t) * t
        if np.linalg.norm(n0) > 1e-8:
            n = n0 / np.linalg.norm(n0)
            b = np.cross(t, n)
            b /= np.linalg.norm(b)
            return t, n, b

    # choose world-up that is not collinear with t
    up = np.array([0.0, 1.0, 0.0]) if abs(t[1]) < 0.9 else np.array([1.0, 0.0, 0.0])
    b = np.cross(t, up)
    b /= np.linalg.norm(b)
    n = np.cross(b, t)
    n /= np.linalg.norm(n)
    return t, n, b


def _xform(
    pos: np.ndarray,
    t: np.ndarray,
    n: np.ndarray,
    b: np.ndarray,
) -> np.ndarray:
    """4×4 homogeneous transform whose columns are the local axes."""
    M = np.eye(4)
    M[:3, 0], M[:3, 1], M[:3, 2], M[:3, 3] = t, n, b, pos
    return M


# ── primitive mesh builders ───────────────────────────────────────────────────

def _module_proto() -> trimesh.Trimesh:
    """
    Rigid module in local frame (centred at origin).
      X = along strip (MOD_L)
      Y = normal / outward (MOD_H)
      Z = lateral / width (MOD_W)
    A dovetail-style interlocking tab projects in ±Z on the module body.
    """
    body = tc.box([MOD_L, MOD_H, MOD_W])

    # male tab on +Z face
    tab_pos = tc.box([TAB_W, TAB_D, TAB_H])
    tab_pos.apply_translation([0.0, (MOD_H - TAB_D) / 2 - MOD_H / 2 + TAB_D / 2,
                                MOD_W / 2 + TAB_H / 2])

    # female recess on -Z face (symmetric tab — mates with adjacent strip)
    tab_neg = tc.box([TAB_W, TAB_D, TAB_H])
    tab_neg.apply_translation([0.0, (MOD_H - TAB_D) / 2 - MOD_H / 2 + TAB_D / 2,
                                -(MOD_W / 2 + TAB_H / 2)])

    return trimesh.util.concatenate([body, tab_pos, tab_neg])


def _bridge_proto() -> trimesh.Trimesh:
    """
    Compliant bridge in local frame (centred at origin).
    Thin in Y (BRIDGE_THICK), full width in Z (MOD_W), short in X (BRIDGE_L).
    """
    return tc.box([BRIDGE_L, BRIDGE_THICK, MOD_W])


# ── path generators ───────────────────────────────────────────────────────────

def path_straight(n: int) -> tuple[list[np.ndarray], list[np.ndarray]]:
    """Straight strip along +Z axis."""
    pos  = [np.array([0.0, 0.0, i * PITCH]) for i in range(n)]
    tang = [np.array([0.0, 0.0, 1.0])       for _ in range(n)]
    return pos, tang


def path_bent(n: int, angle_deg: float = 45.0) -> tuple[list, list]:
    """
    Planar arc in the XZ-plane.
    angle_deg is the total subtended angle (0° = straight, 90° = quarter-circle).
    """
    arc_rad = np.deg2rad(angle_deg)
    total   = (n - 1) * PITCH
    R       = total / arc_rad if arc_rad > 1e-6 else 1e9

    pos, tang = [], []
    for i in range(n):
        frac  = i / max(n - 1, 1)
        theta = frac * arc_rad
        # arc starts at origin, extends into +X and +Z
        pos.append(np.array([R * (1.0 - cos(theta)), 0.0, R * sin(theta)]))
        tang.append(np.array([sin(theta), 0.0, cos(theta)]))
    return pos, tang


def path_coiled(
    n: int,
    r_h: float = 6.0,
    n_turns: float = 2.5,
    strip_len: float = STRIP_LEN,
) -> tuple[list, list, list]:
    """
    Helical (coiled spring) path.
    r_h       – helix radius in mm.  Must satisfy r_h < strip_len/(2π·n_turns).
    n_turns   – number of complete 360° turns.
    Returns (positions, tangents, up_hints) where up_hints are the radial
    outward directions — keeps module faces oriented correctly along the coil.
    """
    r_max = strip_len / (2.0 * pi * n_turns)
    if r_h >= r_max:
        raise ValueError(
            f"r_h={r_h:.1f} mm too large for {n_turns} turns over {strip_len:.0f} mm. "
            f"Max radius = {r_max:.2f} mm."
        )

    circ       = 2.0 * pi * r_h
    len_needed = strip_len / n_turns
    h_turn     = sqrt(len_needed ** 2 - circ ** 2)   # vertical rise per turn

    total_angle = n_turns * 2.0 * pi

    pos, tang, up_hints = [], [], []
    for i in range(n):
        frac  = i / max(n - 1, 1)
        angle = frac * total_angle
        pos.append(np.array([
            r_h * cos(angle),
            r_h * sin(angle),
            frac * n_turns * h_turn,
        ]))
        dx = -r_h * total_angle * sin(angle)
        dy =  r_h * total_angle * cos(angle)
        dz =  n_turns * h_turn
        tv = np.array([dx, dy, dz])
        tang.append(tv / np.linalg.norm(tv))
        # radial outward → keeps module flat-face perpendicular to helix axis
        up_hints.append(np.array([cos(angle), sin(angle), 0.0]))
    return pos, tang, up_hints


def path_twisted(n: int, twist_total_deg: float = 360.0) -> tuple[list, list, list]:
    """
    Straight spine with a progressive roll of the cross-section.
    Returns (positions, tangents, up_hints) – up_hints carry the twist angle.
    """
    pos, tang = path_straight(n)
    twist_step = np.deg2rad(twist_total_deg) / max(n - 1, 1)
    up_hints = [np.array([cos(i * twist_step), sin(i * twist_step), 0.0])
                for i in range(n)]
    return pos, tang, up_hints


# ── strip assembler ───────────────────────────────────────────────────────────

def build_strip(
    positions: list[np.ndarray],
    tangents:  list[np.ndarray],
    up_hints:  list[np.ndarray] | None = None,
) -> trimesh.Trimesh:
    """
    Assemble a Y-Zipper strip from module positions and tangent vectors.
    up_hints (optional) override the propagated normal per module (used for twist).
    Returns a single concatenated Trimesh.
    """
    mod_proto    = _module_proto()
    bridge_proto = _bridge_proto()
    meshes: list[trimesh.Trimesh] = []

    prev_n = np.array([0.0, 1.0, 0.0])   # initial normal guess

    for i, (pos, tang) in enumerate(zip(positions, tangents)):
        hint = up_hints[i] if up_hints is not None else None
        if hint is not None:
            t, n, b = _stable_frame(tang, prev_normal=hint)
        else:
            t, n, b = _stable_frame(tang, prev_normal=prev_n)
        prev_n = n

        # place module
        m = mod_proto.copy()
        m.apply_transform(_xform(pos, t, n, b))
        meshes.append(m)

        # place bridge toward next module
        if i < len(positions) - 1:
            nxt      = np.array(positions[i + 1])
            bc       = (np.array(pos) + nxt) / 2.0
            bt       = nxt - np.array(pos)
            bt      /= np.linalg.norm(bt)
            tb, nb, bb = _stable_frame(bt, prev_normal=prev_n)
            br = bridge_proto.copy()
            br.apply_transform(_xform(bc, tb, nb, bb))
            meshes.append(br)

    return trimesh.util.concatenate(meshes)


# ── visualisation ─────────────────────────────────────────────────────────────

def _equal_3d_axes(ax: Axes3D, verts: np.ndarray) -> None:
    """Force equal aspect ratio on a 3-D axes object."""
    lo, hi = verts.min(axis=0), verts.max(axis=0)
    span   = (hi - lo).max() / 2.0
    mid    = (lo + hi) / 2.0
    ax.set_xlim(mid[0] - span, mid[0] + span)
    ax.set_ylim(mid[1] - span, mid[1] + span)
    ax.set_zlim(mid[2] - span, mid[2] + span)


def render_strip(
    positions:   list[np.ndarray],
    tangents:    list[np.ndarray],
    mesh:        trimesh.Trimesh,
    name:        str,
    save_path:   str,
    up_hints:    list[np.ndarray] | None = None,
    view_plane:  str = "XY",          # 2-D projection panel: 'XY', 'XZ', or 'YZ'
    elev:        float = 25.0,
    azim:        float = 50.0,
) -> None:
    """
    Render a 3-D preview of a Y-Zipper strip and write a PNG.

    Layout
    ──────
    Left  – 3-D isometric view with plasma-coloured mesh faces and
            cool-gradient cross-section quads at each module.
    Right – 2-D orthographic projection (view_plane) with module outlines.
    """
    # map plane label → axis indices and label strings
    _plane_map = {
        "XY": (0, 1, "X (mm)", "Y (mm)", "Top-Down  (XY)"),
        "XZ": (0, 2, "X (mm)", "Z (mm)", "Side-View  (XZ)"),
        "YZ": (1, 2, "Y (mm)", "Z (mm)", "Front-View (YZ)"),
    }
    ax_u, ax_v, lbl_u, lbl_v, plane_title = _plane_map[view_plane]

    fig = plt.figure(figsize=(14, 7))
    fig.patch.set_facecolor("#1a1a2e")

    # ── 3-D panel ─────────────────────────────────────────────────────────────
    ax3 = fig.add_subplot(1, 2, 1, projection="3d")
    ax3.set_facecolor("#16213e")

    verts = mesh.vertices
    faces = mesh.faces

    # every-3rd face subsample for rendering speed
    sample_idx = np.arange(0, len(faces), 3)
    tri_verts  = verts[faces[sample_idx]]        # (N, 3, 3)

    # colour faces by their axial coordinate (longest bbox axis)
    bb_span = verts.max(axis=0) - verts.min(axis=0)
    colour_ax = int(np.argmax(bb_span))
    c_vals = tri_verts[:, :, colour_ax].mean(axis=1)
    c_n    = (c_vals - c_vals.min()) / max(float(c_vals.max() - c_vals.min()), 1e-6)
    colours = plt.cm.plasma(c_n)

    poly3d = Poly3DCollection(tri_verts, alpha=0.50, linewidths=0.0)
    poly3d.set_facecolor(colours)
    ax3.add_collection3d(poly3d)

    # cross-section quads at each module position
    prev_n_vis = np.array([0.0, 1.0, 0.0])
    pos_arr    = np.array(positions)
    n_mods     = len(positions)

    for i, (pos, tang) in enumerate(zip(positions, tangents)):
        hint = up_hints[i] if up_hints is not None else None
        t, n, b = _stable_frame(tang, prev_normal=hint if hint is not None else prev_n_vis)
        prev_n_vis = n

        frac = i / max(n_mods - 1, 1)
        col  = plt.cm.cool(frac)
        hw, hh = MOD_W / 2.0, MOD_H / 2.0

        corners = [
            pos + n * hh + b * hw,
            pos + n * hh - b * hw,
            pos - n * hh - b * hw,
            pos - n * hh + b * hw,
        ]
        quad = Poly3DCollection([corners], alpha=0.80, linewidths=0.4)
        quad.set_facecolor(col)
        quad.set_edgecolor("#cccccc")
        ax3.add_collection3d(quad)

    ax3.plot(pos_arr[:, 0], pos_arr[:, 1], pos_arr[:, 2],
             color="#ff6b6b", linewidth=1.6, alpha=0.9)

    _equal_3d_axes(ax3, verts)
    ax3.set_xlabel("X (mm)", color="white", fontsize=8)
    ax3.set_ylabel("Y (mm)", color="white", fontsize=8)
    ax3.set_zlabel("Z (mm)", color="white", fontsize=8)
    ax3.tick_params(colors="white", labelsize=7)
    ax3.xaxis.pane.fill = ax3.yaxis.pane.fill = ax3.zaxis.pane.fill = False
    ax3.set_title("3-D View", color="white", fontsize=10, pad=6)
    ax3.view_init(elev=elev, azim=azim)

    # ── 2-D projection panel ──────────────────────────────────────────────────
    ax2 = fig.add_subplot(1, 2, 2)
    ax2.set_facecolor("#16213e")
    ax2.set_aspect("equal")

    ax2.plot(pos_arr[:, ax_u], pos_arr[:, ax_v],
             color="#ff6b6b", linewidth=1.6, alpha=0.9)

    prev_n_vis2 = np.array([0.0, 1.0, 0.0])
    for i, (pos, tang) in enumerate(zip(positions, tangents)):
        hint = up_hints[i] if up_hints is not None else None
        t, n, b = _stable_frame(tang, prev_normal=hint if hint is not None else prev_n_vis2)
        prev_n_vis2 = n

        frac = i / max(n_mods - 1, 1)
        col  = plt.cm.cool(frac)
        hw, hh = MOD_W / 2.0, MOD_H / 2.0

        # project corners onto the chosen plane
        corners_2d = np.array([
            [pos[ax_u] + n[ax_u]*hh + b[ax_u]*hw, pos[ax_v] + n[ax_v]*hh + b[ax_v]*hw],
            [pos[ax_u] + n[ax_u]*hh - b[ax_u]*hw, pos[ax_v] + n[ax_v]*hh - b[ax_v]*hw],
            [pos[ax_u] - n[ax_u]*hh - b[ax_u]*hw, pos[ax_v] - n[ax_v]*hh - b[ax_v]*hw],
            [pos[ax_u] - n[ax_u]*hh + b[ax_u]*hw, pos[ax_v] - n[ax_v]*hh + b[ax_v]*hw],
        ])
        patch = plt.Polygon(corners_2d, closed=True, alpha=0.72,
                            facecolor=col, edgecolor="white", linewidth=0.4)
        ax2.add_patch(patch)

    ax2.autoscale_view()
    ax2.set_xlabel(lbl_u, color="white", fontsize=8)
    ax2.set_ylabel(lbl_v, color="white", fontsize=8)
    ax2.tick_params(colors="white", labelsize=7)
    for spine in ax2.spines.values():
        spine.set_edgecolor("#444")
    ax2.set_title(plane_title, color="white", fontsize=10)

    # ── overall title ─────────────────────────────────────────────────────────
    fig.suptitle(
        f"Y-Zipper Strip — {name}\n"
        f"bridge={BRIDGE_THICK:.1f} mm  |  modules={N_MOD}  |  "
        f"strip≈{arc_length(positions):.1f} mm  |  pitch={PITCH:.1f} mm",
        color="white", fontsize=12, fontweight="bold", y=1.01,
    )
    plt.tight_layout()
    plt.savefig(save_path, dpi=150, bbox_inches="tight",
                facecolor=fig.get_facecolor())
    plt.close(fig)


# ── helpers ───────────────────────────────────────────────────────────────────

def arc_length(positions: list[np.ndarray]) -> float:
    arr = np.array(positions)
    return float(np.linalg.norm(np.diff(arr, axis=0), axis=1).sum())


def slug(name: str) -> str:
    return name.lower().replace(" ", "_").replace("°", "deg").replace("/", "_")


# ── main ──────────────────────────────────────────────────────────────────────

VARIANTS: list[dict] = [
    {
        "name":       "Straight Rod",
        "primitive":  "straight",
        "bend_deg":   0.0,
        "note":       "Linear strip — baseline motion primitive",
        "view_plane": "XZ",   # side view shows full length and module height
        "elev":       15.0,
        "azim":       20.0,
    },
    {
        "name":       "Bent Arch 45°",
        "primitive":  "bent",
        "bend_deg":   45.0,
        "note":       "Planar arc, 45° total subtended angle",
        "view_plane": "XZ",   # arc lies in XZ plane
        "elev":       20.0,
        "azim":       -30.0,
    },
    {
        "name":       "Coiled Spring",
        "primitive":  "coiled",
        "bend_deg":   0.0,
        "note":       "Helix: r=6 mm, 2.5 turns",
        "view_plane": "XY",   # top-down shows the spiral clearly
        "elev":       35.0,
        "azim":       60.0,
    },
]


def _build_variant(cfg: dict) -> tuple[list, list, list | None]:
    prim = cfg["primitive"]
    if prim == "straight":
        pos, tang = path_straight(N_MOD)
        return pos, tang, None
    if prim == "bent":
        pos, tang = path_bent(N_MOD, cfg["bend_deg"])
        return pos, tang, None
    if prim == "coiled":
        pos, tang, hints = path_coiled(N_MOD, r_h=6.0, n_turns=2.5)
        return pos, tang, hints
    if prim == "twisted":
        pos, tang, hints = path_twisted(N_MOD)
        return pos, tang, hints
    raise ValueError(f"Unknown primitive: {prim}")


def main() -> None:
    report: list[dict] = []

    for cfg in VARIANTS:
        name = cfg["name"]
        print(f"\n╔══ {name} ({''.join(['═']*(50-len(name)))}╗")

        pos, tang, hints = _build_variant(cfg)
        arc = arc_length(pos)
        print(f"  modules    : {N_MOD}")
        print(f"  arc-length : {arc:.2f} mm")
        print(f"  bridge     : {BRIDGE_THICK} mm")
        print(f"  primitive  : {cfg['primitive']}")

        # build mesh
        print("  building mesh …", end=" ", flush=True)
        mesh = build_strip(pos, tang, up_hints=hints)
        print(f"done  ({len(mesh.faces)} faces, watertight={mesh.is_watertight})")

        # export STL
        stl_path = os.path.join(OUTPUT_DIR, f"yzipper_{slug(name)}.stl")
        mesh.export(stl_path)
        print(f"  STL → {stl_path}")

        # render PNG
        png_path = os.path.join(OUTPUT_DIR, f"yzipper_{slug(name)}.png")
        render_strip(pos, tang, mesh, name, png_path, up_hints=hints,
                     view_plane=cfg.get("view_plane", "XY"),
                     elev=cfg.get("elev", 25.0),
                     azim=cfg.get("azim", 50.0))
        print(f"  PNG → {png_path}")

        report.append({
            "name":              name,
            "primitive":         cfg["primitive"],
            "note":              cfg["note"],
            "strip_length_mm":   round(arc, 2),
            "bend_angle_deg":    cfg["bend_deg"],
            "bridge_thick_mm":   BRIDGE_THICK,
            "module_width_mm":   MOD_W,
            "module_height_mm":  MOD_H,
            "module_length_mm":  MOD_L,
            "bridge_length_mm":  BRIDGE_L,
            "pitch_mm":          PITCH,
            "n_modules":         N_MOD,
            "mesh_faces":        len(mesh.faces),
            "watertight":        bool(mesh.is_watertight),
            "stl_file":          stl_path,
            "png_file":          png_path,
        })

    # ── printed summary table ──────────────────────────────────────────────────
    W = 78
    print(f"\n{'═'*W}")
    print(" Y-ZIPPER DESIGN TOOL — PARAMETER SUMMARY")
    print(f"{'═'*W}")
    hdr = f"  {'Variant':<20} {'Length':>9}  {'Bend°':>6}  {'Bridge':>8}  " \
          f"{'Modules':>7}  Primitive"
    print(hdr)
    print(f"  {'-'*72}")
    for v in report:
        print(
            f"  {v['name']:<20} {v['strip_length_mm']:>8.1f}mm"
            f"  {v['bend_angle_deg']:>5.1f}°"
            f"  {v['bridge_thick_mm']:>7.1f}mm"
            f"  {v['n_modules']:>7d}"
            f"  {v['primitive']}"
        )
    print(f"{'═'*W}")
    print(
        f"  Common: MOD_W={MOD_W} mm | MOD_H={MOD_H} mm | "
        f"MOD_L={MOD_L} mm | PITCH={PITCH} mm"
    )
    print(f"{'═'*W}\n")

    # ── JSON report ───────────────────────────────────────────────────────────
    json_path = os.path.join(OUTPUT_DIR, "yzipper_report.json")
    with open(json_path, "w") as fh:
        json.dump(report, fh, indent=2)
    print(f"Full report → {json_path}")
    print(f"Output dir  → {OUTPUT_DIR}/\n")


if __name__ == "__main__":
    main()
