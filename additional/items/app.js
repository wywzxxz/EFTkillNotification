const puppeteer = require('puppeteer');
const fs=require("fs");
var json={urlcheck:{},items:{}}
try{
	json=JSON.parse(""+require("fs").readFileSync("out.txt"))
}catch(e){}

(async () => {
	const browser = await puppeteer.launch({		
		args:["--proxy-server=socks5://127.0.0.1:1080",'--disable-web-security']
		,headless: false
	});
	const page = await browser.newPage();  
			
	//导入总集列表重图片
	var urls=[
		 "https://escapefromtarkov.gamepedia.com/Weapons"
		,"https://escapefromtarkov.gamepedia.com/Weapon_mods"
		,"https://escapefromtarkov.gamepedia.com/Eyewear"
		,"https://escapefromtarkov.gamepedia.com/Chest_rigs"
		,"https://escapefromtarkov.gamepedia.com/Armor_vests"
		,"https://escapefromtarkov.gamepedia.com/Tactical_clothing"
		,"https://escapefromtarkov.gamepedia.com/Medical"
		,"https://escapefromtarkov.gamepedia.com/Provisions"		
		,"https://escapefromtarkov.gamepedia.com/Loot"
		,"https://escapefromtarkov.gamepedia.com/Keys_%26_Intel"
		,"https://escapefromtarkov.gamepedia.com/Face_cover"
		,"https://escapefromtarkov.gamepedia.com/Headwear"
		,"https://escapefromtarkov.gamepedia.com/Backpacks"		
		
	]
	for (var i_url=0;i_url<urls.length;++i_url)
	{		
		url=urls[i_url]
		console.log(url)
		if(json.urlcheck[url]) console.log("skiped")
		if(json.urlcheck[url]) continue;		
		try{
			await page.goto(url,{waitUntil:"networkidle2"});
			console.log("loaded")
			const res = await page.evaluate(() => {
				var res={}
				var canvas = document.createElement('canvas');				
				async function getDataUrlThroughCanvas(image){					  							
					await new Promise((resolve) => {
						if (image.complete || (image.width) > 0) resolve();
						image.addEventListener('load', () => resolve());
					});
					canvas.width = image.width;
					canvas.height = image.height;			
					var context = canvas.getContext('2d');
					context.drawImage(image, 0, 0);
					return canvas.toDataURL("image/png");
				};
				document.querySelectorAll(".wikitable").forEach(async table=>{
					var title=table.previousElementSibling;if (!title) return;
					if (title.className=="mw-empty-elt")
					{
						title=table.parentElement.title
					}else
					if (title.nodeName=="P")
					{
						title=title.previousElementSibling;if (!title) return;						
						title=title.querySelector(".mw-headline");if (!title) return;
						title=title.innerText.trim();	
					}else
					{
						title=title.querySelector(".mw-headline");if (!title) return;
						title=title.innerText.trim();	
					}
					if (title=="Legend") return;
					console.log(title,table)
					table.querySelectorAll("tr").forEach(async (tr,i_tr)=>{
						if (i_tr==0) return;
						var name=tr.querySelectorAll("a")[0].title.trim();					
						var img=tr.querySelectorAll("img")[0];
						console.log(name,img)
						if (!img) return;
						res[name]=await getDataUrlThroughCanvas(img);
						
					})
				})
				
				return res
			});
			for (var i in res)
			{
				//console.log("\t",i)
				//json.items[i]=res;
				var base64Data = res[i].replace(/^data:image\/\w+;base64,/, "");
				var dataBuffer = new Buffer(base64Data, 'base64');
				fs.writeFileSync("image/"+escape(i.replace(/[\/\*]/g,"_"))+".png",dataBuffer)				
				fs.writeFileSync("../../src/items/"+escape(i.replace(/[\/\*]/g,"_"))+".png",dataBuffer)
			}			
			json.urlcheck[url]=true
			fs.writeFileSync("out.txt",JSON.stringify(json))			
		}catch(e)
		{
			console.log(e)
			throw e
		}
	}
	await browser.close();
})();