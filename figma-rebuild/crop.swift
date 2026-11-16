import AppKit
import Foundation
let root=URL(fileURLWithPath:CommandLine.arguments[1])
let crops:[(String,String,Int,Int,Int,Int)]=[
 ("portrait-trey","image 55.png",23,78,163,215),
 ("portrait-alfonzo","image 55.png",24,457,163,216),
 ("portrait-franklin","image 55.png",25,724,163,218),
 ("texture-blue","image 52.png",10,510,35,100),
 ("texture-paper","Group 6.png",600,150,60,700),
 ("texture-orange","image 62.png",540,90,60,700),
 ("texture-wallpaper","image 60.png",6,160,44,245),
 ("texture-leather","source-web/What-do-you-read.png",300,155,350,140),
 ("texture-cream","source-web/What-do-you-read.png",120,1150,40,400),
 ("texture-desk","image 53.png",208,430,150,65)
]
for (name,file,x,y,w,h) in crops {
 let img=NSImage(contentsOf:root.appendingPathComponent(file))!
 let cg=img.cgImage(forProposedRect:nil,context:nil,hints:nil)!
 let cropped=cg.cropping(to:CGRect(x:x,y:y,width:w,height:h))!
 let b=NSBitmapImageRep(cgImage:cropped)
 try b.representation(using:.png,properties:[:])!.write(to:root.appendingPathComponent("figma-rebuild/"+name+".png"))
}
