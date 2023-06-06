class Agent {

    index;  // エージェントのインデックス
    position;  // エージェントの位置ベクトル
    velocity;  // エージェントの速度ベクトル

    maxSpeed;  // エージェントの最大速度
    maxForce;  // エージェントの最大力

    separationRadius;  // 分離の半径
    alignRadius;  // 整列の半径
    cohesionRadius;  // 結束の半径

    t;  // エージェントの時間パラメータ

    constructor(index) {
        this.index = this.padzero(index);  // インデックスを0埋めして設定
        this.position = createVector(
            random(width), random(height)
        );  // ランダムな位置で初期化
        this.velocity = createVector(
            random(-1, 1), random(-1, 1)
        );  // ランダムな速度で初期化

        this.maxForce = 0.2;  // 最大力を設定
        this.maxSpeed = 3.0;  // 最大速度を設定

        this.separationRadius = 25;  // 分離の半径を設定
        this.alignRadius = 40;  // 整列の半径を設定
        this.cohesionRadius = 40;  // 結束の半径を設定

        this.t = 0;  // 時間パラメータを初期化
        noSmooth()
    }

    update() {
        noSmooth()
        this.velocity.limit(this.maxSpeed);  // 速度の制限
        this.position.add(this.velocity);  // 位置の更新
        this.wrapBound();  // 境界条件を適用

        this.t += this.velocity.mag() * 5.0;  // 時間パラメータの更新
        this.t = this.t % 360;  // 360度でループ
    }

    draw() {//どrー
        //以下新

        
//   drawingContext.shadowBlur = 40;
//   drawingContext.shadowColor = color(245, 228, 184);
  //以上新
  noSmooth()
  stroke('rgb(220, 222, 202)');
  strokeWeight(1);
        const c = map(sin(radians(this.t)), -90, 90, 80, 355);
        //fill(c);  // 色の設定
        circle(this.position.x, this.position.y, 6);  // 円を描画
        textSize(width / 230);
        circle(this.position.x+random(-50,50), this.position.y+random(-50,50),2);
        circle(this.position.x+random(-50,50), this.position.y+random(-50,50),2);


        line(this.position.x, this.position.y,  this.position.x+random(-50,50), this.position.y+random(-50,50));
        line(this.position.x, this.position.y,  this.position.x+random(-50,50), this.position.y+random(-50,50));
        line(this.position.x, this.position.y,  this.position.x+random(-50,50), this.position.y+random(-50,50));

        
        
        

        //以下ついか
        noFill();


        circle(this.position.x, this.position.y, 22);  // 円を描画
        // 以上追加
        
    }

    attract(target, radius) {
        const V = p5.Vector;
        const dist = V.dist(this.position, target);  // エージェントと目標位置との距離を計算
        if (dist < radius) {  // 目標位置が一定の半径内にある場合
            const acceleration = p5.Vector.sub(target, this.position);  // 目標位置とエージェントの間のベクトルを計算
            acceleration.setMag(radius / dist);  // 加速度の大きさを調整
            acceleration.limit(this.maxForce);  // 加速度を最大力に制限
            this.velocity.add(acceleration * 113);  // 速度に加速度を加える
        }
    }

    repel(target, radius) {
        const V = p5.Vector;
        const dist = V.dist(this.position, target);  // エージェントと目標位置との距離を計算
        if (dist < radius) {  // 目標位置が一定の半径内にある場合
            const acceleration = p5.Vector.sub(this.position, target);  // 目標位置からエージェントへのベクトルを計算
            acceleration.setMag(radius / dist);  // 加速度の大きさを調整
            acceleration.limit(this.maxForce);  // 加速度を最大力に制限
            this.velocity.add(acceleration);  // 速度に加速度を加える
        }
    }

    flock(agents) {
        const sep = this.separate(agents);  // 分離の計算
        const ali = this.align(agents);  // 整列の計算
        const coh = this.cohesion(agents);  // 結束の計算

        sep.mult(1.6);  // 分離の重み付け
        ali.mult(1.0);  // 整列の重み付け
        coh.mult(1.5);  // 結束の重み付け

        this.velocity.add(sep);  // 速度に分離を加える
        this.velocity.add(ali);  // 速度に整列を加える
        this.velocity.add(coh);  // 速度に結束を加える
    }

    separate(agents) {
        const V = p5.Vector;

        let sum = createVector(0, 0);  // ベクトルの合計
        let totalCount = 0;  // エージェントの総数

        for (const agent of agents) {
            if (this.index !== agent.index) {  // 自分自身でない場合
                const dist = V.dist(this.position, agent.position);  // エージェント間の距離を計算
                if (dist < this.separationRadius) {  // 分離の半径内にある場合
                    const dir = V.sub(this.position, agent.position).normalize();  // 分離方向ベクトルを計算
                    dir.div(dist);  // ベクトルを正規化
                    sum.add(dir);  // ベクトルを合計に加える
                    totalCount++;  // カウントを増やす
                }
            }
        }

        if (totalCount > 0) {  // 合計が0より大きい場合
            sum.div(totalCount);  // ベクトルを平均化
            sum.setMag(this.maxSpeed);  // ベクトルの大きさを最大速度に設定
            const steer = V.sub(sum, this.velocity);  // ベクトルの差を計算
            steer.limit(this.maxForce);  // ベクトルを最大力に制限
            return steer;  // ベクトルを返す
        } else {
            return createVector(0, 0);  // ゼロベクトルを返す
        }

    }

    align(agents) {
        const V = p5.Vector;
        
        let sum = createVector(0, 0);  // ベクトルの合計
        let totalCount = 0;  // エージェントの総数

        for (const agent of agents) {
            const dist = V.dist(this.position, agent.position);  // エージェント間の距離を計算
            if (this.index !== agent.index) {  // 自分自身でない場合
                if (dist < this.alignRadius) {  // 整列の半径内にある場合
                    sum.add(agent.velocity);  // 速度ベクトルを合計に加える
                    totalCount++;  // カウントを増やす
                }
            }
        }

        if (totalCount > 0) {  // 合計が0より大きい場合
            sum.div(totalCount);  // ベクトルを平均化
            sum.setMag(this.maxSpeed);  // ベクトルの大きさを最大速度に設定
            const steer = V.sub(sum, this.velocity);  // ベクトルの差を計算
            steer.limit(this.maxForce);  // ベクトルを最大力に制限
            return steer;  // ベクトルを返す
        } else {
            return createVector(0, 0);  // ゼロベクトルを返す
        }
    }

    cohesion(agents) {
        const V = p5.Vector;
        
        let center = createVector(0, 0);  // 重心のベクトル
        let totalCount = 0;  // エージェントの総数

        for (const agent of agents) {
            const dist = V.dist(this.position, agent.position);  // エージェント間の距離を計算
            if (this.index !== agent.index) {  // 自分自身でない場合
                if (dist < this.cohesionRadius) {  // 結束の半径内にある場合
                    center.add(agent.position);  // 位置ベクトルを合計に加える
                    totalCount++;  // カウントを増やす
                }
            }
        }

        if (totalCount > 0) {  // 合計が0より大きい場合
            center.div(totalCount);  // 位置ベクトルを平均化
            const desired = V.sub(center, this.position);  // 目標方向ベクトルを計算
            desired.setMag(this.maxSpeed);  // ベクトルの大きさを最大速度に設定
            const steer = V.sub(desired, this.velocity);  // ベクトルの差を計算
            steer.limit(this.maxForce);  // ベクトルを最大力に制限
            return steer;  // ベクトルを返す
        } else {
            return createVector(0, 0);  // ゼロベクトルを返す
        }
    }

    wrapBound() {
        const pos = this.position;  // 位置ベクトルの参照を作成
        if (pos.x < 0) pos.x = width;  // 左端を超えた場合、右端に移動
        if (pos.x > width) pos.x = 0;  // 右端を超えた場合、左端に移動
        if (pos.y < 0) pos.y = height;  // 上端を超えた場合、下端に移動
        if (pos.y > height) pos.y = 0;  // 下端を超えた場合、上端に移動
    }

    padzero(num) {
        return num.toString().padStart(4, '0');  // 4桁の数字に0パディング
    }

}
