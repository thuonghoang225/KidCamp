// Đưa màu minh họa gần giống về đúng hex thương hiệu (chỉ màu bão hòa, dE<7).
// Chạy thử: node scripts/snap-art-colors.mjs public/img/kidcamp   ·  Áp dụng: thêm tham số --apply
// Giữ bảng màu brand đồng bộ với src/app/globals.css.
import fs from "node:fs"; import path from "node:path";
const [dir, apply] = process.argv.slice(2);
const brand = {"forest-50":"#eefaf2","forest-100":"#d5f2de","forest-200":"#a9e3bd","forest-500":"#2f9e5b","forest-600":"#22824a","forest-700":"#1b663b","forest-900":"#0f3a22","sun-100":"#fff4cc","sun-300":"#ffdb66","sun-400":"#ffc933","sun-500":"#f5b301","sun-700":"#8a6400","sky-100":"#e3f2ff","sky-400":"#4fa8f0","sky-500":"#2b8fe0","sky-600":"#1f78c4","sky-700":"#175f9e","ember-100":"#ffe6dc","ember-500":"#f06a3a","ember-600":"#c2461a","ember-700":"#9e3812","cream":"#fffbf2","ink":"#1f2a24"};
const lab=h=>{let [r,g,b]=[1,3,5].map(i=>parseInt(h.slice(i,i+2),16)/255).map(v=>v>.04045?((v+.055)/1.055)**2.4:v/12.92);
 let x=(r*.4124+g*.3576+b*.1805)/.95047,y=r*.2126+g*.7152+b*.0722,z=(r*.0193+g*.1192+b*.9505)/1.08883;
 const f=t=>t>.008856?Math.cbrt(t):7.787*t+16/116;[x,y,z]=[f(x),f(y),f(z)];return[116*y-16,500*(x-y),200*(y-z)]};
const dE=(a,b)=>{const p=lab(a),q=lab(b);return Math.hypot(p[0]-q[0],p[1]-q[1],p[2]-q[2])};
const files=fs.readdirSync(dir).filter(f=>f.startsWith("art-")&&f.endsWith(".svg"));
const counts={};for(const f of files)for(const m of fs.readFileSync(path.join(dir,f),"utf8").matchAll(/#[0-9a-fA-F]{6}\b/g)){const k=m[0].toLowerCase();counts[k]=(counts[k]||0)+1}
const map={};
for(const [h,n] of Object.entries(counts).sort((a,b)=>b[1]-a[1])){let best,bd=1e9;for(const[k,v]of Object.entries(brand)){const d=dE(h,v);if(d<bd){bd=d;best=k}}
 const lb=lab(h),C=Math.hypot(lb[1],lb[2]);if(bd>0.5&&bd<7&&C>35){map[h]=brand[best];console.log(h,n,"->",best,brand[best],"dE",bd.toFixed(1))}}
console.log("snapped",Object.keys(map).length,"of",Object.keys(counts).length);
if(apply){for(const f of files){const p=path.join(dir,f);const s=fs.readFileSync(p,"utf8").replace(/#[0-9a-fA-F]{6}\b/g,m=>map[m.toLowerCase()]??m);fs.writeFileSync(p,s)}}
