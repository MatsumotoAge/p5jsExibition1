const agents = [];
let subdiv;
let t = 0;
//追加したところ以下
const canvasWidth = 900; // キャンバスの幅
const canvasHeight = 760; // キャンバスの高さ

//以上追加

setup = () => {
    noSmooth()
    pixelDensity(0.6);
    const canvas = createCanvas(canvasWidth, canvasHeight);  // キャンバスのサイズを設定
   
    canvas.parent('#container');  // キャンバスを指定した要素に配置
    canvas.id('p5');  // キャンバスに固有のIDを設定
    
    textSize(8);  // テキストのサイズを設定
    strokeWeight(0.5);  // ストロークの太さを設定

    for (let i = 0; i < 120; i++) {  // 200個のエージェントを生成
        agents.push(new Agent(i));  // エージェントを配列に追加
    }

    subdiv = new Subdiv();  // サブディビジョンを作成

    

}

draw = () => {
    noSmooth()
  
    background(0);  // 背景色を黒に設定
    const mouse = createVector(mouseX, mouseY);  // マウスの位置をベクトルとして取得
    
    for (const agent of agents) {  // エージェントごとに処理を実行

        if (mouseIsPressed) {  // マウスが押されている場合
            agent.attract(mouse, 200);  // マウスに引き寄せる
        } else {
            agent.repel(mouse, 100);  // マウスから反発する
        }

        agent.flock(agents);  // エージェントの群れの振る舞いを適用
        agent.update();  // 位置を更新
    }

    subdiv.compute(agents);  // サブディビジョンを計算
    //stroke(200);
    //subdiv.drawVoronoi();
    t += 2;  // tを増加させる
    t %= 360;  // 360で割った余りを求める
    const c = map(sin(radians(t)), -1, 90, 100, 0);  // sin関数を使用して色を計算
    stroke(c);  // ストロークの色を設定
    subdiv.drawVoronoi();  // サブディビジョンを描画

    for (const agent of agents) {  // エージェントごとに描画
        agent.draw();  // エージェントを描画
    }
}
