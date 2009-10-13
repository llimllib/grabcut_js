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

function MultivariateDistribution(weights, mus, variances) {
    return new Object({
        weights: weights,
        mus: mus,
        variances: variances,
        sample: function(n) {
        }
    });
}
