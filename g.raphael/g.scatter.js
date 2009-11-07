/*
 * g.Raphael 0.4 - Charting library, based on Raphaël
 *
 * Copyright (c) 2009 Dmitry Baranovskiy (http://g.raphaeljs.com)
 * this file modified 2009 from Dmitry's g.line.js by Bill Mill
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */
Raphael.fn.g.scatterplot = function (x, y, width, height, valuesx, valuesy, opts) {
    opts = opts || {};
    if (!this.raphael.is(valuesx[0], "array")) {
        valuesx = [valuesx];
    }
    if (!this.raphael.is(valuesy[0], "array")) {
        valuesy = [valuesy];
    }
    var allx = Array.prototype.concat.apply([], valuesx),
        ally = Array.prototype.concat.apply([], valuesy),
        len = Math.max(valuesx[0].length, valuesy[0].length),
        symbol = opts.symbol || "o",
        colors = opts.colors || Raphael.fn.g.colors,
        that = this,
        columns = null,
        dots = null,
        chart = this.set(),
        path = [],
        minall = Math.min(Math.min.apply(Math, allx), Math.min.apply(Math, ally)),
        maxall = Math.max(Math.max.apply(Math, allx), Math.max.apply(Math, ally)),
        ///XXX: probably breaks if valuesx.length != valuesy.length. FIXME
        //XXX: always sets the two axes to the same values
        xdim = ydim = this.g.snapEnds(minall, maxall, valuesx[0].length - 1),
        minx = xdim.from,
        maxx = xdim.to,
        gutter = opts.gutter || 10,
        kx = (width - gutter * 2) / (maxx - minx),
        miny = ydim.from,
        maxy = ydim.to,
        ky = (height - gutter * 2) / (maxy - miny),
        axminx = opts.axminx || minx,
        axmaxx = opts.axmaxx || maxx,
        axminy = opts.axminy || miny,
        axmaxy = opts.axmaxy || maxy;

    for (var i = 0, ii = valuesy.length; i < ii; i++) {
        len = Math.max(len, valuesy[i].length);
    }
    var shades = this.set();
    for (var i = 0, ii = valuesy.length; i < ii; i++) {
        if (opts.shade) {
            shades.push(this.path().attr({stroke: "none", fill: colors[i], opacity: opts.nostroke ? 1 : .3}));
        }
    }
    var axis = this.set();
    if (opts.axis) {
        var ax = (opts.axis + "").split(/[,\s]+/);
        +ax[0] && axis.push(this.g.axis(x + gutter, y + gutter, width - 2 * gutter, minx, maxx, opts.axisxstep || Math.floor((width - 2 * gutter) / 20), 2));
        +ax[1] && axis.push(this.g.axis(x + width - gutter, y + height - gutter, height - 2 * gutter, axminy, axmaxy, opts.axisystep || Math.floor((height - 2 * gutter) / 20), 3));
        +ax[2] && axis.push(this.g.axis(x + gutter, y + height - gutter, width - 2 * gutter, axminx, axmaxx, opts.axisxstep || Math.floor((width - 2 * gutter) / 20), 0));
        +ax[3] && axis.push(this.g.axis(x + gutter, y + height - gutter, height - 2 * gutter, axminy, axmaxy, opts.axisystep || Math.floor((height - 2 * gutter) / 20), 1));
    }
    var symbols = this.set();
    for (var i = 0, ii = valuesy.length; i < ii; i++) {
        var sym = this.raphael.is(symbol, "array") ? symbol[i] : symbol,
            symset = this.set();
        path = [];
        for (var j = 0, jj = valuesy[i].length; j < jj; j++) {
            var X = x + gutter + ((valuesx[i] || valuesx[0])[j] - minx) * kx;
            var Y = y + height - gutter - (valuesy[i][j] - miny) * ky;
            (Raphael.is(sym, "array") ? sym[j] : sym) && symset.push(this.g[Raphael.fn.g.markers[this.raphael.is(sym, "array") ? sym[j] : sym]](X, Y, (opts.width || 2)).attr({fill: colors[i], stroke: "none"}));
            path = path.concat([j ? "L" : "M", X, Y]);
        }
        symbols.push(symset);
        if (opts.shade) {
            shades[i].attr({path: path.concat(["L", X, y + height - gutter, "L",  x + gutter + ((valuesx[i] || valuesx[0])[0] - minx) * kx, y + height - gutter, "z"]).join(",")});
        }
    }

    function createDots(f) {
        var cvrs = f || that.set(),
            C;
        for (var i = 0, ii = valuesy.length; i < ii; i++) {
            for (var j = 0, jj = valuesy[i].length; j < jj; j++) {
                var X = x + gutter + ((valuesx[i] || valuesx[0])[j] - minx) * kx,
                    nearX = x + gutter + ((valuesx[i] || valuesx[0])[j ? j - 1 : 1] - minx) * kx,
                    Y = y + height - gutter - (valuesy[i][j] - miny) * ky;
                f ? (C = {}) : cvrs.push(C = that.circle(X, Y, Math.abs(nearX - X) / 2).attr({stroke: "none", fill: "#000", opacity: 0}));
                C.x = X;
                C.y = Y;
                C.value = valuesy[i][j];
                C.shade = chart.shades[i];
                C.symbol = chart.symbols[i][j];
                C.symbols = chart.symbols[i];
                C.axis = (valuesx[i] || valuesx[0])[j];
                f && f.call(C);
            }
        }
        !f && (dots = cvrs);
    }
    chart.push(shades, symbols, axis, columns, dots);
    chart.shades = shades;
    chart.symbols = symbols;
    chart.axis = axis;
    chart.hover = function (fin, fout) {
        !dots && createDots();
        dots.mouseover(fin).mouseout(fout);
        return this;
    };
    chart.click = function (f) {
        !dots && createDots();
        dots.click(f);
        return this;
    };
    chart.each = function (f) {
        createDots(f);
        return this;
    };
    chart.eachColumn = function (f) {
        createColumns(f);
        return this;
    };
    return chart;
};
