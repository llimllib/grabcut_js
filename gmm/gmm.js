function NormalDistribution(sigma, mu) {
    return new Object({
        sigma: sigma,
        mu: mu,
        sample: function() {
            var res;
            if (this.storedDeviate) {
                res = this.storedDeviate * this.sigma + this.mu;
                this.storedDeviate = null;
            } else {
                var dist = Math.sqrt(-1 * Math.log(Math.random()));
                var angle = 2 * Math.PI * Math.random();
                this.storedDeviate = dist*Math.cos(angle);
                res = dist*Math.sin(angle) * this.sigma + this.mu;
            }
            return res;
        },
        sampleInt : function() {
            return Math.round(this.sample());
        }
    });
}

/*
 * weight: number
 *   QQQ NOTE: what do the weights mean?
 * mus: 2-dimensional vector; standard deviations of the cluster
 *   QQQ NOTE: 2-dimensional, meaning x and y weights? what are the weights?
 * variance: 2-dimensional vector of floats
 *   QQQ NOTE: shocking, I don't know what these mean!
 *
 *   Note that this code is largely translated & simplified from scikits
 */
function TwoDDistribution(weight, mus, variances) {
    return new Object({
        weights: weight,
        mus: mus,
        variances: variances,

        //return an array of n 2d vectors
        randn: function(n) {
            var a = [];
            for (i=0; i < n; i++) {
                a.push([Math.random(), Math.random()]);
            }
            return a;
        },

        sample: function(n) {
            //the first thing we do is generate a vector of n random variables
            var x = this.randn(n);

            //TODO: abstract vector multiplication to the matrix lib?
            for (i=0; i < n; i++) {
                x[i][0] = this.mus[0] + x[i][0] * Math.sqrt(this.variances[0]);
                x[i][1] = this.mus[1] + x[i][1] * Math.sqrt(this.variances[1]);
            }

            return x;
        }
    });
}
