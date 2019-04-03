from bencode import bencode, bdecode
from io import BytesIO
import hashlib

objTorrentFile = open("test.torrent", "rb")
decodedDict = bdecode(objTorrentFile.read())
info_hash = hashlib.sha1(bencode(decodedDict["info"])).hexdigest()
print(info_hash)
