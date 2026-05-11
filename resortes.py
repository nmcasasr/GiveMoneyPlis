#!/usr/bin/env python3
"""
Generador de resortes Y-Zipper
Uso: python3 resortes.py
"""

import os
import numpy as np
from numpy import cos, sin, pi, sqrt
import trimesh
import trimesh.creation as tc
import matplotlib
matplotlib.use("Agg")
import matplotlib.pyplot as plt
from mpl_toolkits.mplot3d import Axes3D          # noqa: F401
from mpl_toolkits.mplot3d.art3d import Poly3DCollection

OUTPUT_DIR = os.path.join(os.path.dirname(__file__), "output")
os.makedirs(OUTPUT_DIR, exist_ok=True)

# ── Parámetros base ────────────────────────────────────────────────────────────
BRIDGE_THICK = 0.8
MOD_W        = 8.0
MOD_H        = 3.5
MOD_L        = 3.2
BRIDGE_L     = 0.8
PITCH        = MOD_L + BRIDGE_L   # 4.0 mm
N_MOD        = 25
TAB_H        = 1.5
TAB_W        = 2.8
TAB_D        = MOD_H * 0.55

# ── Variantes — ajusta aquí ────────────────────────────────────────────────────
# Restricción: r_h < (N_MOD-1)*PITCH / (2π × n_turns)
SPRINGS = [
    {"name": "Apretado", "r_h": 4.0, "n_turns": 3.0},
    {"name": "Abierto",  "r_h": 8.0, "n_turns": 1.5},
    {"name": "Largo",    "r_h": 3.2, "n_turns": 4.0},
]


# ── Geometría ──────────────────────────────────────────────────────────────────

def _frame(tangent, prev_n=None):
    t = np.array(tangent, dtype=float)
    t /= np.linalg.norm(t)
    if prev_n is not None:
        n0 = np.array(prev_n, dtype=float)
        n0 -= np.dot(n0, t) * t
        if np.linalg.norm(n0) > 1e-8:
            n = n0 / np.linalg.norm(n0)
            return t, n, np.cross(t, n) / np.linalg.norm(np.cross(t, n))
    up = np.array([0., 1., 0.]) if abs(t[1]) < 0.9 else np.array([1., 0., 0.])
    b = np.cross(t, up); b /= np.linalg.norm(b)
    return t, np.cross(b, t), b


def _xform(pos, t, n, b):
    M = np.eye(4)
    M[:3, 0], M[:3, 1], M[:3, 2], M[:3, 3] = t, n, b, pos
    return M


def _module():
    body = tc.box([MOD_L, MOD_H, MOD_W])
    tab  = tc.box([TAB_W, TAB_D, TAB_H])
    tab.apply_translation([0., 0., MOD_W / 2 + TAB_H / 2])
    tab2 = tc.box([TAB_W, TAB_D, TAB_H])
    tab2.apply_translation([0., 0., -(MOD_W / 2 + TAB_H / 2)])
    return trimesh.util.concatenate([body, tab, tab2])


def _bridge():
    return tc.box([BRIDGE_L, BRIDGE_THICK, MOD_W])


def helix_path(n, r_h, n_turns):
    strip_len = (n - 1) * PITCH
    r_max = strip_len / (2.0 * pi * n_turns)
    if r_h >= r_max:
        raise ValueError(f"r_h={r_h} debe ser < {r_max:.2f} mm para {n_turns} vueltas")
    circ   = 2.0 * pi * r_h
    h_turn = sqrt((strip_len / n_turns) ** 2 - circ ** 2)
    total  = n_turns * 2.0 * pi

    pos, tang, hints = [], [], []
    for i in range(n):
        f = i / max(n - 1, 1)
        a = f * total
        pos.append(np.array([r_h * cos(a), r_h * sin(a), f * n_turns * h_turn]))
        tv = np.array([-r_h * total * sin(a), r_h * total * cos(a), n_turns * h_turn])
        tang.append(tv / np.linalg.norm(tv))
        hints.append(np.array([cos(a), sin(a), 0.]))   # radial outward
    return pos, tang, hints


def build(pos, tang, hints):
    mod_p = _module()
    br_p  = _bridge()
    meshes = []
    prev_n = np.array([0., 1., 0.])
    for i, (p, t, h) in enumerate(zip(pos, tang, hints)):
        _, n, b = _frame(t, prev_n=h); prev_n = n
        m = mod_p.copy(); m.apply_transform(_xform(p, t, n, b))
        meshes.append(m)
        if i < len(pos) - 1:
            bc = (np.array(p) + np.array(pos[i+1])) / 2
            bt = np.array(pos[i+1]) - np.array(p); bt /= np.linalg.norm(bt)
            tb, nb, bb = _frame(bt, prev_n=prev_n)
            br = br_p.copy(); br.apply_transform(_xform(bc, tb, nb, bb))
            meshes.append(br)
    return trimesh.util.concatenate(meshes)


# ── Visualización ──────────────────────────────────────────────────────────────

def render(springs_data):
    fig = plt.figure(figsize=(18, 12))
    fig.patch.set_facecolor("#1a1a2e")

    for idx, (cfg, pos, tang, hints, mesh, arc) in enumerate(springs_data):
        pos_arr = np.array(pos)
        n = len(pos)

        # 3D (fila superior)
        ax3 = fig.add_subplot(2, 3, idx + 1, projection="3d")
        ax3.set_facecolor("#0d1b2a")

        for i in range(n - 1):
            frac = i / max(n - 2, 1)
            seg  = pos_arr[i:i+2]
            ax3.plot(seg[:,0], seg[:,1], seg[:,2],
                     color=plt.cm.plasma(frac), lw=3.0, alpha=0.95)

        prev_n = np.array([0., 1., 0.])
        for i, (p, t, h) in enumerate(zip(pos, tang, hints)):
            _, nv, bv = _frame(t, prev_n=h); prev_n = nv
            if i % 3 != 0:
                continue
            frac = i / max(n - 1, 1)
            hw, hh = MOD_W / 2, MOD_H / 2
            corners = [p+nv*hh+bv*hw, p+nv*hh-bv*hw,
                       p-nv*hh-bv*hw, p-nv*hh+bv*hw]
            q = Poly3DCollection([corners], alpha=0.75, linewidths=0.5)
            q.set_facecolor(plt.cm.cool(frac))
            q.set_edgecolor("#ffffff")
            ax3.add_collection3d(q)

        r = cfg["r_h"]
        lo, hi = pos_arr.min(0), pos_arr.max(0)
        span = max((hi - lo).max() / 2, r + MOD_W)
        mid  = (lo + hi) / 2
        ax3.set_xlim(mid[0]-span, mid[0]+span)
        ax3.set_ylim(mid[1]-span, mid[1]+span)
        ax3.set_zlim(lo[2]-5, hi[2]+5)
        for fn, lbl in [(ax3.set_xlabel,"X"),(ax3.set_ylabel,"Y"),(ax3.set_zlabel,"Z")]:
            fn(f"{lbl} (mm)", color="white", fontsize=8)
        ax3.tick_params(colors="white", labelsize=6)
        ax3.xaxis.pane.fill = ax3.yaxis.pane.fill = ax3.zaxis.pane.fill = False
        ax3.set_title(
            f"Resorte {cfg['name']}\nr={cfg['r_h']} mm · {cfg['n_turns']} vueltas",
            color="white", fontsize=11, fontweight="bold")
        ax3.view_init(elev=25, azim=55)

        # Vista lateral XZ (fila inferior)
        ax2 = fig.add_subplot(2, 3, idx + 4)
        ax2.set_facecolor("#0d1b2a")
        ax2.plot(pos_arr[:,0], pos_arr[:,2], color="#ff6b6b", lw=2.0)

        prev_n2 = np.array([0., 1., 0.])
        for i, (p, t, h) in enumerate(zip(pos, tang, hints)):
            _, nv, bv = _frame(t, prev_n=h); prev_n2 = nv
            frac = i / max(n - 1, 1)
            hw, hh = MOD_W / 2, MOD_H / 2
            corners_xz = np.array([
                [p[0]+nv[0]*hh+bv[0]*hw, p[2]+nv[2]*hh+bv[2]*hw],
                [p[0]+nv[0]*hh-bv[0]*hw, p[2]+nv[2]*hh-bv[2]*hw],
                [p[0]-nv[0]*hh-bv[0]*hw, p[2]-nv[2]*hh-bv[2]*hw],
                [p[0]-nv[0]*hh+bv[0]*hw, p[2]-nv[2]*hh+bv[2]*hw],
            ])
            ax2.add_patch(plt.Polygon(corners_xz, closed=True, alpha=0.65,
                          facecolor=plt.cm.cool(frac),
                          edgecolor="white", lw=0.3))

        ax2.autoscale_view()
        ax2.set_aspect("equal")
        ax2.set_xlabel("X (mm)", color="white", fontsize=8)
        ax2.set_ylabel("Z (mm)", color="white", fontsize=8)
        ax2.tick_params(colors="white", labelsize=7)
        for sp in ax2.spines.values():
            sp.set_edgecolor("#333")
        ax2.set_title(f"Vista lateral XZ · {arc:.1f} mm", color="white", fontsize=9)

    fig.suptitle(
        f"Y-Zipper — Variantes de Resorte\n"
        f"bridge={BRIDGE_THICK} mm  |  {N_MOD} módulos  |  pitch={PITCH} mm",
        color="white", fontsize=13, fontweight="bold")
    plt.tight_layout(rect=[0, 0, 1, 0.95])
    out = os.path.join(OUTPUT_DIR, "resortes_comparacion.png")
    plt.savefig(out, dpi=150, bbox_inches="tight", facecolor=fig.get_facecolor())
    plt.close()
    return out


# ── Main ───────────────────────────────────────────────────────────────────────

def main():
    springs_data = []
    for cfg in SPRINGS:
        name = cfg["name"]
        print(f"\n── Resorte {name} ──")
        pos, tang, hints = helix_path(N_MOD, cfg["r_h"], cfg["n_turns"])
        arc = float(np.linalg.norm(np.diff(np.array(pos), axis=0), axis=1).sum())
        print(f"  arc={arc:.1f} mm")

        mesh = build(pos, tang, hints)
        print(f"  watertight={mesh.is_watertight}  faces={len(mesh.faces)}")

        stl = os.path.join(OUTPUT_DIR, f"resorte_{name.lower()}.stl")
        mesh.export(stl)
        print(f"  STL → {stl}")

        springs_data.append((cfg, pos, tang, hints, mesh, arc))

    png = render(springs_data)
    print(f"\nPNG → {png}")
    print("Listo.")


if __name__ == "__main__":
    main()
