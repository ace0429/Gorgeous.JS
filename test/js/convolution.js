//Test:Convolution Test
var g = gorgeous;

var src = 'img/beauty.jpg';
var tip = document.createElement('h3');
tip.innerHTML = 'Loading baboon image, please wait...';
document.body.appendChild(tip);
g.loadImage(src, function (img) {
	tip.innerHTML = 'Baboon image loaded.';
	var ctx = g.makeCanvasContext(img.width, img.height);
	ctx.drawImage(img, 0, 0, img.width, img.height);
	var canvas = ctx.canvas;
	Test(
		['g.convolution', function (test) {
			var res = [57, 52, 32, 255, 106, 67, 38, 255, 77, 58, 22, 255, 85, 77, 47, 255, 160, 101, 58, 255, 116, 87, 34, 255, 57, 52, 32, 255, 106, 67, 38, 255, 77, 58, 22, 255];
			var width = 3, height = 3;
			var matrix = new Uint8ClampedArray(width * height * 4);
			var v = [
				[131, 41, 72, 255],
				[124, 191, 70, 255],
				[224, 71, 31, 255]
			];
			var i = 0;
			for (var y = 0; y < height; y++) {
				for (var x = 0; x < width; x++) {
					for (var j = 0; j < v[0].length; j++) {
						matrix[4 * (y * width + x) + j] = v[i][j];
					}
					if (++i === v.length) {
						i = 0;
					}
				}
			}

			var kernel = g.makeKernel([
				1, 1, 1,
				1, 1, 1,
				1, 1, 1
			].map(function (v) { return v / 9; }));
			g.convolution(matrix, width, height, kernel);

			test.pass(res.every(function (v, i) {
				return v === matrix[i];
			}));
		}],
		['register kernels', function (test) {
			var k = [
				1, 1, 1,
				1, 1, 1,
				1, 1, 1
			].map(function (v) { return v / 9; });
			g.registerKernel('平均值', k);
			test.pass(g.kernels['平均值'].every(function (v) {
				return v.every(function (v) {
					return v === 1 / 9;
				});
			}));
		}],
		['use kernel', function (test) {
			var imd = new g.ImageData(img);
			imd.useKernel('平均值');
			imd.getImage(function (img) {
				test.show('平均值掩模', img);
			});
			g.registerKernel('拉普拉斯', [
				-1, -1, -1,
				-1, 8, -1,
				-1, -1, -1
			]);
			imd.useKernel('拉普拉斯');
			imd.getImage(function (img) {
				test.show('拉普拉斯掩模', img);
			});
			g.registerKernel('Sobel', [
				-1, -2, -1,
				0, 0, 0,
				1, 2, 1
			]);
			imd.useKernel('Sobel');
			imd.getImage(function (img) {
				test.show('Sobel', img);
			});
		}]
	);
});