function world(options) {
  // всякая инициализационная хрень
  if (this instanceof world === false) {
    return new world(options);
  }
  var self = this;
  this.Init(options);
}

world.prototype.Init = function(options) {
  if( typeof this.options != "object" )
    this.options = {};

  let flag = true;
  if( this.options.seed && !options.seed )
    flag = false;
  if( this.options.seed && options.seed && this.options.seed == options.seed )
    flag = false;

  this.options.seed = options.seed||1;
  this.options.size = options.size||8;
  this.options.width = Math.pow(2,options.size+1);
  this.options.height = Math.pow(2,options.size);

  if( flag ){
    this.random = new rerandom(this.options.seed);
    this.count = 0;
    this.noise = [];
    this.noise_size=256; // do not change
    //this.map = [];
    this.Generate();
  }
};

world.prototype.Generate = function(options) {
  console.log("start");
  for(let i=0;i<12;i++){
    this.noise[i]=this.GenerateNoises(i,false);
  }
  //this.GenerateNoise();
  console.log("finish");
};

world.prototype.GenerateNoises = function(divide) {
  let step = 64>>divide;
  //if(step==0) step=1;
  if(step<1) step=1;

  let mask = (4096>>divide)-1;

  let noise=[];

  let noise_size = this.noise_size;
  const nw = noise_size<<1;
  const nh = noise_size;

  for(let x=0; x<nw; x++){
    noise[x] = [];
    for(let y=0; y<nh; y++){
      if( x%step || y%step ){
        noise[x][y] = noise[x-(x%step)][y-(y%step)];
      }else{
        noise[x][y] = this.random.GetxxHash(y*nw+x)&4095;
        if(divide<3){
          if( y<step ) noise[x][y]=Math.floor(noise[x][y]*0.6);
          if( y>=nh-step ) noise[x][y]=Math.floor(noise[x][y]*0.6);
          if( x<step ) noise[x][y]=Math.floor(noise[x][y]*0.7);
          if( x>=nw-step ) noise[x][y]=Math.floor(noise[x][y]*0.7);
        }
      }
  }}
  noise = this.BlurNoise(noise,nw,nh,step);
  return noise;
};


world.prototype.BlurNoise = function(noise,w,h,count) {
  //const w = this.noise_size<<1;
  //const h = this.noise_size;
  var step = 1;
  for(let i=0; i<count;i++){
    //let noise = []
    for(let x=0; x<w;x++){
     //noise[x] = [];
      for(let y=0; y<h;y++){
        x1=x-step;
        y1=y-step;
        if(x1<0) x1+=w;
        if(y1<0) y1+=h;
        x2=x+step;
        y2=y+step;
        if(x2>=w) x2-=w;
        if(y2>=h) y2-=h;
        noise[x][y]  =
            noise[x1][y1] + noise[x][y1] + noise[x2][y1]
          + noise[x1][y]                 + noise[x2][y]
          + noise[x1][y2] + noise[x][y2] + noise[x2][y2];
        noise[x][y]=noise[x][y]>>3;
      }
    }
  }
  return noise;
};

world.prototype.DrawPerlin = function(img) {
  // const mw = 2<<this.options.size;
  // const mh = 1<<this.options.size;
  // const iw = img.width;
  // const ih = img.height;
  // const step = mh/ih;
  // console.log(iw,ih,step);
  // //Math.floor(
  // for(let x=0; x<iw; x++){
  // for(let y=0; y<ih; y++){
  //   //let p = this.GetMapPoint({x: Math.floor(x*step), y: Math.floor(y*step)});
  //   let p = this.GetMapPoint({x: Math.floor(x*step), y: Math.floor(y*step)});
  //   this.drawPixelForMap(img, x, y, p.h);
  // }}
  // this.DrawRivers(img);
  const iw = img.width;
  const ih = img.height;
  console.log(iw,ih);
  for(let x=0; x<512; x++){
  for(let y=0; y<256; y++){
    let p = this.GetMapPoint({x: x, y: y});
    this.drawPixelForMap(img, x, y, p.h);
  }}
};

world.prototype.DrawRivers = function(img) {
}

world.prototype.GetMapPoint = function(point) {
  if( !point || typeof point != "object" )
    point = {
      x: 0,
      y: 0,
      h: 0
    }
  const count = this.options.size-9; //**//
  const nw = this.noise_size<<1;
  const nh = this.noise_size;
  const offset = this.options.size-7;
  point.h = 0;
  for(let i=0; i<count;i++){

      //let mask =
      // let xx = Math.abs(point.x>>offset);
      // let yy = Math.abs(point.y>>offset);
      // xx = xx%nw;
      // yy = yy%nh;
      // point.h+=this.noise[i][xx][yy]>>i;

      point.h+=this.noise[i][point.x][point.y]>>(i>>1);
  }
  point.h=point.h>>1;
  return point;
};

var hc=[
{u:64, c:{r:4,g:53,b:180}},
{u:88, c:{r:9,g:63,b:220}},
{u:100, c:{r:18,g:83,b:242}},
{u:116, c:{r:54,g:136,b:252}},
{u:128, c:{r:92,g:169,b:252}},
{u:128, c:{r:128,g:192,b:230}},
{u:128, c:{r:231,g:238,b:187}},
{u:135, c:{r:45,g:148,b:68}},
{u:145, c:{r:35,g:104,b:48}},
{u:155, c:{r:44,g:127,b:36}},
{u:158, c:{r:89,g:162,b:91}},
{u:164, c:{r:119,g:153,b:120}},
{u:167, c:{r:189,g:192,b:102}},
{u:170, c:{r:193,g:189,b:145}},
{u:175, c:{r:173,g:158,b:112}},
{u:180, c:{r:150,g:128,b:93}},
{u:185, c:{r:106,g:98,b:86}},
{u:187, c:{r:100,g:93,b:83}},
{u:256, c:{r:80,g:80,b:80}}
];

world.prototype.drawPixelForMap = function(img,x,y,h){
    let z=h>>5;

    let sund_level = 1+((16<<5)>>(this.options.size-8));


    let c=hc[12].c;
    let i=0;
    for(i=0;i<hc.length;i++){
      c=hc[i].c;
      if( hc[i].u>z ) break;
    }
    // c.r=z;
    // c.g=z;
    // c.b=z;
    this.drawPixel(img, x, y, c.r, c.g, c.b, 255);
}


world.prototype.drawPixel = function(img,x,y,r,g,b,a){
  var o = (y*img.width+x)*4;
    img.data[o+0]=r; // красный
    img.data[o+1]=g; // зеленый
    img.data[o+2]=b; // синий
    img.data[o+3]=a; // прозрачность
}
