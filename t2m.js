var fs = require("fs");
var bencode = require('bencode');
var sha1 = require('js-sha1');
var arguments = process.argv.splice(2); //获取命令行参数，第三个元素是带的参数

outMagnets(getMagnets(arguments), arguments);

// 获取磁链链接，arguments为文件夹路径
function getMagnets(arguments) {
    var fileslist = fs.readdirSync(arguments.toString());
    var magnetlist = new Array();

    for (var f in fileslist) {
        var torrentfile = null;
        var filename = fileslist[f].toString();
        if (filename.includes(".torrent")) {
            var filepath = arguments.toString() + '/' + filename;
            var magnet = getInfoHash(filepath);
            if (magnet) {
                magnetlist.push(magnet);
            }
            //console.log(magnet);
        }
    }
    return magnetlist;
}

// 将结果输出为txt
function outMagnets(magnets, path) {
    if (magnets.length > 0) {
        var writebuffer = Buffer.from(arrayToString(magnets, '\n'));
        var savepath = path.toString() + '/' + "magnets.txt";
        var writesteam = fs.createWriteStream(savepath);
        writesteam.write(writebuffer, 'utf-8');
        writesteam.end();
        writesteam.on('finish', function () {
            console.log("写入完成");
        });
        writesteam.on('error', function (err) {
            console.log(err);
        });
    }
}

// buffer只能输出字符，所以必须将字符数组转换为字符形式，seq为分隔符
function arrayToString(arr, seq) {
    var str_value = null;
    for (a of arr) {
        var astr = a.toString();
        if (str_value) {
            str_value = str_value + seq + astr;
        } else {
            str_value = astr;
        }
    }
    return str_value;
}
// 获取种子文件的info_hash值，有一个解密，再加密的过程
function getInfoHash(torrentfile) {
    var result = bencode.decode(fs.readFileSync(torrentfile));
    if (result) {
        var info = result['info']; //info 字典
        var info_hash = sha1(bencode.encode(info));
        var magnet = "magnet:?xt=urn:btih:" + info_hash.toString();
        return magnet;
    } else {
        return null;
    }
}