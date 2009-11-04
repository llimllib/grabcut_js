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
            var randn = NormalDistribution(1, 0);
            var a = [];
            for (i=0; i < n; i++) {
                a.push([randn.sample(), randn.sample()]);
            }
            return a;
        },

        //XXX: this is the "full", the "diag" is the one that needs the
        //     cholesky. Implement that? Why/why not? Is this a real
        //     gaussian? How to tell?
        sample: function(n) {
            //the first thing we do is generate a vector of n random variables
            var x = this.randn(n);

            //TODO: abstract vector multiplication to the matrix lib?
            for (i=0; i < n; i++) {
                x[i][0] = this.mus[0] + x[i][0] * Math.sqrt(this.variances[0]);
                x[i][1] = this.mus[1] + x[i][1] * Math.sqrt(this.variances[1]);
            }

            return x;
        },

        sample_full: function(n) {
            var rands = randn(n);
            var mva = $M(this.variances);
            var mmus = $M(this.mus);
            var l = cholesky(mva);
            var r = l.x(rands.transpose());
            for (i=0; i < n; i++) {
                r.elements[0][i] += mmus.elements[0][0];
                r.elements[1][i] += mmus.elements[1][0];
            }

            return r.transpose();
        },
            
    });
}
