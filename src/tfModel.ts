export class TfModel {

    /*getModel(player,isNewModel): TfModel {

        var model = tf.sequential();
        model.add(tf.layers.dense({
            units: 8,
            inputShape: [5],
            activation: 'sigmoid'
        }));
        model.add(tf.layers.dense({
            units: 2,
            activation: 'softmax'
        }));
        player.update = function() {
            if (myPhysics && !myPhysics.world.isPaused) {
                this.model.points++;
                this.model.predict();
            }
        };
        if (!isNewModel) {
            pickOneModel(player,model,0.2)
        }
        return {
            points: 0,
            model: model,
            player: player,
            getCurrentState: function() {
                return [this.player.body.y/config.height,
                        closestPipe[0].body.y/config.height,
                        closestPipe[1].body.y/config.height,
                        closestPipe[0].body.x/config.width,
                        this.player.body.velocity.y/config.height];
            },
            predict: function() {
                tf.tidy(()=>{
                    const inputs = this.getCurrentState();
                    const xs = tf.tensor2d([inputs]);
                    const ys = this.model.predict(xs);
                    const outputs = ys.dataSync();
                    if (outputs[0] > outputs[1]) {
                        this.player.setVelocityY(JUMP_SPEED);
                    }
                });
            }
        };

    }*/
}