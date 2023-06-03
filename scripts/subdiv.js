class Subdiv {

    voronoi;
    bbox;
    diagram;

    constructor() {
        this.voronoi = new Voronoi();  // Voronoiオブジェクトのインスタンスを作成
        this.bbox = { xl: 0, xr: width, yt: 0, yb: height };  // バウンディングボックスを設定
    }

    compute(agents) {
        this.voronoi.recycle(this.diagram);  // ダイアグラムをリサイクル
        const sites = agents.map(agent => agent.position);  // エージェントの位置を取得
        this.diagram = this.voronoi.compute(sites, this.bbox);  // ボロノイ図を計算
    }

    drawVoronoi() {
        noSmooth()
        for (const edge of this.diagram.edges) {  // 各エッジに対して処理を実行
            line(edge.va.x, edge.va.y, edge.vb.x, edge.vb.y);  // エッジを描画
        }
    }

    drawDelaunay() {
        noSmooth()
        for (const cell of this.diagram.cells) {  // 各セルに対して処理を実行
            for (const he of cell.halfedges) {  // セルのハーフエッジごとに処理を実行
                const p0 = he.edge.lSite;  // 左側のサイト（エージェント）を取得
                const p1 = he.edge.rSite;  // 右側のサイト（エージェント）を取得
                if (p0 && p1) {
                    if (p0.dist(p1) < 20) {  // サイト間の距離が20未満の場合に処理を実行
                        line(p0.x, p0.y, p1.x, p1.y);  // エッジを描画
                    }
                }
            }
        }
    }

}

// このスクリプトでは、Voronoi図とDelaunay三角形分割を行うためのクラス Subdiv が定義されています。

// Subdiv のコンストラクタでは、Voronoiオブジェクトのインスタンスを作成し、バウンディングボックスを設定します。

// compute メソッドでは、与えられたエージェントの位置からボロノイ図を計算します。

// drawVoronoi メソッドでは、ボロノイ図のエッジを描画します。

// drawDelaunay メソッドでは、デローネ三角形分割のエッジを描画します。ただし、サイト（エージェント）間の距離が50未満の場合にのみ描画されます。

// これにより、エージェントの振る舞いに基づいてボロノイ図とデローネ三角形分割が描画されます。
