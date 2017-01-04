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
  this.GenerateNoise();
  console.log("finish");
};

world.prototype.GenerateNoise = function() {
  const step = 32;
  const nw = this.noise_size<<1;
  const nh = this.noise_size;
  for(let x=0; x<nw; x++){
    this.noise[x] = [];
    for(let y=0; y<nh; y++){
      if( x%step || y%step ){
        this.noise[x][y] = this.noise[x-(x%step)][y-(y%step)];
      }else{
        this.noise[x][y] = this.random.GetxxHash(y*nw+x)&4095;
      }
  }}
  this.BlurNoise(step<<3);
};

world.prototype.BlurNoise = function(count) {
  const w = this.noise_size<<1;
  const h = this.noise_size;
  for(let i=0; i<count;i++){
    //let noise = []
    for(let x=0; x<w;x++){
     //noise[x] = [];
      for(let y=0; y<h;y++){
        x1=x-1;
        y1=y-1;
        if(x1<0) x1+=w;
        if(y1<0) y1+=h;
        x2=x+1;
        y2=y+1;
        if(x2>=w) x2-=w;
        if(y2>=h) y2-=h;
        this.noise[x][y]  =
            this.noise[x1][y1] + this.noise[x][y1] + this.noise[x2][y1]
          + this.noise[x1][y]                      + this.noise[x2][y]
          + this.noise[x1][y2] + this.noise[x][y2] + this.noise[x2][y2];
        this.noise[x][y]=this.noise[x][y]>>3;
      }
    }
    //this.noise = noise;
  }
};

world.prototype.DrawPerlin = function(img) {
  const mw = 2<<this.options.size;
  const mh = 1<<this.options.size;
  const iw = img.width;
  const ih = img.height;
  const step = mh/ih;
  console.log(iw,ih,step);
  //Math.floor(
  for(let x=0; x<iw; x++){
  for(let y=0; y<ih; y++){
    let p = this.GetMapPoint({x: Math.floor(x*step), y: Math.floor(y*step)});
    this.drawPixelForMap(img, x, y, p.h);
  }}
  this.DrawRivers(img);
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
  const count = this.options.size-4;
  const nw = this.noise_size<<1;
  const nh = this.noise_size;
  const offset = this.options.size-8;
  point.h = 0;
  for(let i=0; i<count;i++){
      let xx = Math.abs((point.x<<i)>>offset);
      let yy = Math.abs((point.y<<i)>>offset);
      xx = xx%nw;
      yy = yy%nh;
      point.h+=this.noise[xx][yy]>>i;
  }
  return point;
};

world.prototype.drawPixelForMap = function(img,x,y,h){
    let z=h>>5;
    let c = {r:0,g:0,b:0};

    let sund_level = 1+((16<<5)>>(this.options.size-8));


    if(z<128){
      c.b=((z>>4)<<4);
      c.g=((z>>3)<<3)-64;
    }else if(h<(128<<5)+sund_level ){
      c.g=z;
      c.r=z;
    }else if(z<152){
      c.g=z-96;
      c.r=(z-128);
    }else if(z<164){
      c.r=z>>1;
      c.g=z>>1;
      c.b=z>>1;
    }else{
      c.r=z;
      c.g=z;
      c.b=z;
    }

    this.drawPixel(img, x, y, c.r, c.g, c.b, 255);
}


world.prototype.drawPixel = function(img,x,y,r,g,b,a){
  var o = (y*img.width+x)*4;
    img.data[o+0]=r; // красный
    img.data[o+1]=g; // зеленый
    img.data[o+2]=b; // синий
    img.data[o+3]=a; // прозрачность
}
