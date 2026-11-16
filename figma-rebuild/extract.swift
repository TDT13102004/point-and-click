import Foundation
import Vision
import AppKit
let root = URL(fileURLWithPath: CommandLine.arguments[1])
let names = ["Group 6.png","image 52.png","image 53.png","image 54.png","image 55.png","image 58.png","image 59.png","image 60.png","image 61.png","image 62.png","image 63.png","source-web/Parking-Garage.png","source-web/Soltion.png","source-web/What-did-they-do.png","source-web/What-do-you-read.png","source-web/Who-are-the-shadow-people.png"]
var docs:[[String:Any]]=[]
for name in names {
 let url=root.appendingPathComponent(name)
 let image=NSImage(contentsOf:url)!
 let cg=image.cgImage(forProposedRect:nil,context:nil,hints:nil)!
 let req=VNRecognizeTextRequest();req.recognitionLevel = .accurate;req.recognitionLanguages=["en-US"];req.usesLanguageCorrection=false;req.usesCPUOnly=true
 try VNImageRequestHandler(cgImage:cg).perform([req])
 let w=Double(cg.width),h=Double(cg.height)
 let lines=(req.results ?? []).map { o -> [String:Any] in
 let b=o.boundingBox
 return ["text":o.topCandidates(1).first!.string,"x":b.minX*w,"y":(1-b.maxY)*h,"w":b.width*w,"h":b.height*h]
 }.sorted { ($0["y"] as! Double) < ($1["y"] as! Double) }
 docs.append(["file":name,"w":w,"h":h,"lines":lines])
}
try JSONSerialization.data(withJSONObject:docs,options:[.prettyPrinted,.sortedKeys]).write(to:root.appendingPathComponent("figma-rebuild/ocr.json"))
