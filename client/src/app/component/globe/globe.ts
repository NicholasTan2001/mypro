import { Component, OnInit, ElementRef, ViewChild, OnDestroy } from '@angular/core';


@Component({
  selector: 'app-globe',
  standalone: true,
  templateUrl: './globe.html',
})
export class GlobeComponent implements OnInit, OnDestroy {
  @ViewChild('globeCanvas', { static: true }) canvasRef!: ElementRef<HTMLCanvasElement>;

  private scale = 220;
  private rotation = [0, -20];
  private dragging = false;
  private lastPos: [number, number] | null = null;
  private velocity = [0, 0];
  private animFrame = 0;
  private world: any = null;

  ngOnInit() {
    this.initGlobe();
  }

  ngOnDestroy() {
    cancelAnimationFrame(this.animFrame);
  }

  private async initGlobe() {
    const [d3, topojson] = await Promise.all([
      import('https://cdn.jsdelivr.net/npm/d3@7/+esm' as any),
      import('https://cdn.jsdelivr.net/npm/topojson-client@3/+esm' as any)
    ]);

    const canvas = this.canvasRef.nativeElement;
    const ctx = canvas.getContext('2d')!;
    const W = canvas.width, H = canvas.height;
    const rotation = this.rotation;
    let scale = this.scale;

    const projection = d3.geoOrthographic()
      .scale(scale).translate([W / 2, H / 2])
      .clipAngle(90).rotate(rotation);

    const path = d3.geoPath(projection, ctx);
    const graticule = d3.geoGraticule()();

    const data = await fetch('https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json').then(r => r.json());
    const countries = topojson.feature(data, data.objects.countries);

    const draw = () => {
      ctx.clearRect(0, 0, W, H);
      projection.rotate(rotation).scale(scale);
      const dark = window.matchMedia('(prefers-color-scheme: dark)').matches;

      ctx.beginPath(); path({ type: 'Sphere' });
      ctx.fillStyle = dark ? '#1a1035' : '#dbeafe'; ctx.fill();
      ctx.strokeStyle = dark ? '#4c1d95' : '#a78bfa'; ctx.lineWidth = 1; ctx.stroke();

      ctx.beginPath(); path(graticule);
      ctx.strokeStyle = dark ? 'rgba(167,139,250,0.15)' : 'rgba(109,40,217,0.12)';
      ctx.lineWidth = 0.5; ctx.stroke();

      countries.features.forEach((f: any) => {
        ctx.beginPath(); path(f);
        ctx.fillStyle = dark ? '#7c3aed' : '#6d28d9'; ctx.fill();
        ctx.strokeStyle = dark ? '#0f0720' : '#ffffff'; ctx.lineWidth = 0.5; ctx.stroke();
      });

      drawMalaysia();

      const shine = ctx.createRadialGradient(W / 2 - scale * 0.3, H / 2 - scale * 0.3, 0, W / 2, H / 2, scale);
      shine.addColorStop(0, 'rgba(255,255,255,0.12)');
      shine.addColorStop(1, 'transparent');
      ctx.beginPath(); path({ type: 'Sphere' });
      ctx.fillStyle = shine; ctx.fill();
    };

    const malaysia = { lat: 4.2105, lng: 109.4208, name: 'Malaysia' };

    const project = (lat: number, lng: number) => {
      const p = projection([lng, lat]);
      return p;
    };

    let particles: { x: number, y: number, size: number, alpha: number, speed: number }[] = [];
    let sparkTimer = 0;

    const addSparks = (x: number, y: number) => {
      for (let i = 0; i < 6; i++) {
        particles.push({
          x: x + (Math.random() - 0.5) * 10,
          y: y + (Math.random() - 0.5) * 10,
          size: Math.random() * 3 + 1,
          alpha: 1,
          speed: Math.random() * 1.5 + 0.5,
        });
      }
    };

    const drawMalaysia = () => {
      const point = project(malaysia.lat, malaysia.lng);
      if (!point) return;

      const [x, y] = point;

      const visible = d3.geoDistance([malaysia.lng, malaysia.lat], [-rotation[0], -rotation[1]]) < Math.PI / 2;
      if (!visible) return;

      const pingSize = (Date.now() % 1500) / 1500;
      ctx.beginPath();
      ctx.arc(x, y, pingSize * 18, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(250, 204, 21, ${1 - pingSize})`;
      ctx.lineWidth = 1.5;
      ctx.stroke();

      const pingSize2 = ((Date.now() + 750) % 1500) / 1500;
      ctx.beginPath();
      ctx.arc(x, y, pingSize2 * 18, 0, Math.PI * 2);
      ctx.strokeStyle = `rgba(250, 204, 21, ${1 - pingSize2})`;
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.beginPath();
      ctx.arc(x, y, 4, 0, Math.PI * 2);
      ctx.fillStyle = '#facc15';
      ctx.fill();
      ctx.strokeStyle = '#ffffff';
      ctx.lineWidth = 1;
      ctx.stroke();

      ctx.font = '500 11px sans-serif';
      ctx.fillStyle = '#facc15';
      ctx.fillText('Malaysia', x + 7, y - 7);

      sparkTimer++;
      if (sparkTimer % 20 === 0) addSparks(x, y);

      particles = particles.filter(p => p.alpha > 0.05);
      particles.forEach(p => {
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(250, 204, 21, ${p.alpha})`;
        ctx.fill();
        p.y -= p.speed;
        p.x += (Math.random() - 0.5) * 0.5;
        p.alpha -= 0.03;
        p.size *= 0.97;
      });
    };

    const animate = () => {
      if (!this.dragging && (Math.abs(this.velocity[0]) > 0.01 || Math.abs(this.velocity[1]) > 0.01)) {
        rotation[0] += this.velocity[0]; rotation[1] += this.velocity[1];
        rotation[1] = Math.max(-90, Math.min(90, rotation[1]));
        this.velocity[0] *= 0.95; this.velocity[1] *= 0.95;
      } else if (!this.dragging) {
        rotation[0] += 0.15;
      }
      draw();
      this.animFrame = requestAnimationFrame(animate);
    };

    const getPos = (e: MouseEvent | TouchEvent): [number, number] => {
      const r = canvas.getBoundingClientRect();
      if ('touches' in e) return [e.touches[0].clientX - r.left, e.touches[0].clientY - r.top];
      return [(e as MouseEvent).clientX - r.left, (e as MouseEvent).clientY - r.top];
    };

    canvas.addEventListener('mousedown', e => { this.dragging = true; this.lastPos = getPos(e); this.velocity = [0, 0]; canvas.style.cursor = 'grabbing'; });
    canvas.addEventListener('mousemove', e => {
      if (!this.dragging || !this.lastPos) return;
      const pos = getPos(e);
      const dx = pos[0] - this.lastPos[0], dy = pos[1] - this.lastPos[1];
      this.velocity = [dx * 0.3, dy * 0.3];
      rotation[0] += dx * 0.3; rotation[1] -= dy * 0.3;
      rotation[1] = Math.max(-90, Math.min(90, rotation[1]));
      this.lastPos = pos;
    });
    canvas.addEventListener('mouseup', () => { this.dragging = false; canvas.style.cursor = 'grab'; });
    canvas.addEventListener('mouseleave', () => { this.dragging = false; canvas.style.cursor = 'grab'; });
    animate();


  }


}
