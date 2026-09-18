(() => {
  "use strict";
  const e = window.__ODIUM_DATA;
  const caravanRoutingData = window.__ODIUM_CARAVAN_ROUTES || null;
  if (!e || 4 !== e.version)return void(document.body.innerHTML = '<main class="fatal-error">Не удалось загрузить карту ресурсов.</main>');
  delete window.__ODIUM_DATA;
  try { delete window.__ODIUM_CARAVAN_ROUTES; } catch {}
  const t = "odium-world-map-preferences-v4",n = "Карта мира",a = 3168,o = 4096,r = [0,1,2],s = [{
    id:"tree",name:"Дерево",color:"#76a56c"
  },{
    id:"crystal",name:"Кристальная Жила",color:"#75c7dc"
  },{
    id:"ore",name:"Руда",color:"#c8874f"
  },{
    id:"alchemy",name:"Алхимические ресурсы",color:"#d4a84f"
  }],i = [{
    id:"forgotten-temple",name:"Забытый Храм",search:"forgotten temple ft",monogram:"FT",subtitle:"Закрытая локация · точная карта",entrance:{
      x:1035.998317,y:3427.997701
    },floors:[{
      id:"main",name:"Основной уровень",width:1024,height:1024,asset:"assets/dungeons/forgotten-temple.png"
    }]
  },{
    id:"lair-of-antharas",name:"Логово Антараса",search:"lair of antharas loa логово дракона",monogram:"LoA",subtitle:"Пещера · точная карта",entrance:{
      x:2523.955786,y:2818.75651
    },floors:[{
      id:"main",name:"Пещера",width:1024,height:1024,asset:"assets/dungeons/lair-of-antharas.png"
    }]
  },{
    id:"forge-of-the-gods",name:"Кузница Богов",search:"forge of the gods fog кузница богов",monogram:"FoG",subtitle:"Подземелье · 2 уровня",entrance:{
      x:2854.963258,y:1096.315017
    },floors:[{
      id:"upper",name:"Верхний уровень",width:1024,height:1024,asset:"assets/dungeons/forge-upper.png"
    },{
      id:"lower",name:"Нижний уровень",width:1024,height:1024,asset:"assets/dungeons/forge-lower.png"
    }]
  },{
    id:"tower-of-insolence",name:"Башня Дерзости",search:"tower of insolence toi башня дерзости тои",monogram:"ToI",subtitle:"Башня · 12 этажей",entrance:{
      x:2300.11932,y:2087.774955
    },floors:Array.from({
      length:12
    },(e,t) => {
      const n = String(t + 1).padStart(2,"0");
      return {
        id:`floor-${n}`,name:`${t+1}-й этаж`,width:1024,height:1024,asset:`assets/dungeons/tower-of-insolence-${n}.png`
      }
    })
  },{
    id:"giants-cave",name:"Пещера Гигантов",search:"giants cave пещера гигантов gc",monogram:"GC",subtitle:"Пещера · 2 уровня",entrance:{
      x:2836.582294,y:2382.795509
    },floors:[{
      id:"upper",name:"Верхний уровень",width:1024,height:1024,asset:"assets/dungeons/giants-cave-upper.png"
    },{
      id:"lower",name:"Нижний уровень",width:1024,height:1024,asset:"assets/dungeons/giants-cave-lower.png"
    }]
  },{
    id:"cruma-tower",name:"Башня Крумы",search:"cruma tower башня крумы ct",monogram:"CT",subtitle:"Башня · 3 этажа",entrance:{
      x:1568.400816,y:2818.629159
    },floors:[1,2,3].map(e => ({
      id:`floor-${e}`,name:`${e}-й этаж`,width:1024,height:1024,asset:`assets/dungeons/cruma-tower-0${e}.png`
    }))
  },{
    id:"abandoned-mines",name:"Заброшенные Шахты",search:"abandoned mines заброшенные шахты am",monogram:"AM",subtitle:"Шахты · точная карта",entrance:{
      x:2726.979507,y:664.032221
    },floors:[{
      id:"main",name:"Шахты",width:1024,height:1024,asset:"assets/dungeons/abandoned-mines.png"
    }]
  },{
    id:"devils-isle",name:"Остров Дьявола",search:"devils isle остров дьявола di",monogram:"DI",subtitle:"Закрытая локация · точная карта",entrance:{
      x:1808.449158,y:3554.96696
    },floors:[{
      id:"main",name:"Остров",width:1024,height:1024,asset:"assets/dungeons/devils-isle.png"
    }]
  }],l = {
  };
  ["app","sidebar","closeSidebar","openSidebar","mobileScrim","globalSearch","filterSummary","worldMapButton","locationList","locationCount","levelList","resourceCount","resourceList","resetFiltersButton","pointsStat","visibleStat","mapsStat","backToWorldButton","breadcrumbs","breadcrumbSeparator","currentMapName","togglePortalsButton","togglePortalsLabel","helpButton","mapViewport","mapStage","mapImage","dungeonPlaceholder","placeholderLocationName","portalLayer","markerLayer","floorSwitcher","mapOnboarding","closeOnboarding","zoomStatus","zoomInButton","zoomOutButton","detailsDrawer","detailsEyebrow","closeDetails","detailsContent","helpDialog","toast"].forEach(e => {
    l[e] = document.getElementById(e)
  });
  const c = {
    resources:e.resources,bands:e.bands,zones:e.zones,points:e.points
  };
  let d = function(){
    try {
      const n = JSON.parse(localStorage.getItem(t));
      if (!n)return h();
      const a = new Set(e.resources.map((e,t) => t)),o = new Set(r);
      return {
        resources:Array.isArray(n.resources)?n.resources.filter(e => a.has(e)):[0,1,2],bands:Array.isArray(n.bands)?n.bands.filter(e => o.has(e)):[...o],portalsVisible:!1 !== n.portalsVisible,onboardingDismissed:Boolean(n.onboardingDismissed)
      }
    } catch {
      return h()
    }
  }(),m = "",u = null,p = 0;
  const g = {
    currentMapId:"world",currentFloorId:null,width:a,height:o,scale:1,minScale:.05,maxScale:3,panX:0,panY:0,pointerId:null,dragStartX:0,dragStartY:0,dragPanX:0,dragPanY:0,didDrag:!1,selectedPointId:null
  };
  window.__odiumMapRouteApi = {
    getView:() => ({
      mapId:g.currentMapId,
      floorId:g.currentFloorId,
      asset:l.mapImage?.getAttribute("src") || "assets/world-map.png",
      width:g.width,
      height:g.height,
      scale:g.scale
    }),
    clientToMap:(clientX,clientY) => {
      const rect = l.mapViewport.getBoundingClientRect();
      return {
        x:(clientX - rect.left - g.panX) / g.scale,
        y:(clientY - rect.top - g.panY) / g.scale
      };
    }
  };
  function h(){
    return {
      resources:[0,1,2],bands:[...r],portalsVisible:!0,onboardingDismissed:!1
    }
  }function b(){
    try {
      localStorage.setItem(t,JSON.stringify(d))
    } catch {
    }
  }function f(e){
    return String(e ?? "").replaceAll("&","&amp;").replaceAll("<","&lt;").replaceAll(">","&gt;").replaceAll('"',"&quot;").replaceAll("'","&#039;")
  }function y(e){
    const t = Number(e);
    return Number.isFinite(t)?Math.round(t).toLocaleString("ru-RU"):"—"
  }function I(e){
    return "world" === g.currentMapId ?{
      x:e.mapX,y:e.mapY
    }:"lair-of-antharas" !== g.currentMapId || null === e.detailX || null === e.detailY ?null:{
      x:e.detailX,y:e.detailY
    }
  }function S(e){
    const t = I(e);
    return t ?{
      ...e,displayX:t.x,displayY:t.y
    }:null
  }function w(e){
    return I(e) || {
      x:e.mapX,y:e.mapY
    }
  }function M(e){
    return i.find(t => t.id === e) || null
  }function x(){
    return M(g.currentMapId)
  }function V(){
    const e = x();
    return e?.floors.find(e => e.id === g.currentFloorId) || e?.floors[0] || null
  }function v(e){
    if (!d.resources.includes(e.resourceIndex) || !d.bands.includes(e.bandIndex))return !1;
    if (!m)return !0;
    const t = c.resources[e.resourceIndex],n = c.zones[e.zoneIndex];
    return `${t.name} ${n.name} ${c.bands[e.bandIndex]}`.toLowerCase().includes(m)
  }function k(){
    return c.points.filter(v)
  }function E(e){
    return s[Math.min(e.resourceIndex,3)]
  }function P(){
    l.locationList.innerHTML = "";
    const e = m;
    i.filter(t => `${t.name} ${t.search}`.toLowerCase().includes(e)).forEach(e => {
      const t = document.createElement("button");
      t.type = "button",t.className = "location-item" + (g.currentMapId === e.id ?" is-active":""),t.innerHTML = `\n        <span class="location-monogram">${f(e.monogram)}</span>\n        <span><strong>${f(e.name)}</strong><small>${f(e.subtitle)}</small></span>\n        <span class="nav-arrow" aria-hidden="true">›</span>`,t.addEventListener("click",() => N(e.id)),l.locationList.append(t)
    }),l.worldMapButton.classList.toggle("is-active","world" === g.currentMapId),l.levelList.innerHTML = "";
    const t = c.bands.map((e,t) => c.points.filter(e => e.bandIndex === t).length);
    r.forEach(e => {
      const n = c.bands[e],a = L({
        id:`band-${e}`,label:`Уровни ${n}`,symbol:"▰",color:["#c77745","#d55f48","#e0a341"][e],count:t[e],checked:d.bands.includes(e),disabled:0 === t[e],onChange:t => C("bands",e,t)
      });
      l.levelList.append(a)
    }),l.resourceList.innerHTML = "",c.resources.forEach((e,t) => {
      const n = c.points.filter(e => e.resourceIndex === t).length,a = L({
        id:`resource-${t}`,label:e.name,symbol:e.symbol,color:e.color,count:n,checked:d.resources.includes(t),onChange:e => C("resources",t,e)
      });
      l.resourceList.append(a)
    });
    const n = k().length;
    l.filterSummary.textContent = `Показано ${y(n)} из ${y(c.points.length)}`,l.locationCount.textContent = String(i.length),l.resourceCount.textContent = String(c.resources.length),l.pointsStat.textContent = y(c.points.length),l.visibleStat.textContent = y(n),l.mapsStat.textContent = String(i.length + 1)
  }function L({
    id:e,label:t,symbol:n,color:a,count:o,checked:r,disabled:s = !1,onChange:i
  }){
    const l = document.createElement("div");
    l.className = "resource-filter" + (s ?" is-disabled":""),l.style.setProperty("--resource-color",a),l.innerHTML = `\n      <input class="resource-toggle" id="${e}" type="checkbox" ${r?"checked":""} ${s?"disabled":""} />\n      <label for="${e}"><span class="filter-symbol">${f(n)}</span>${f(t)}</label>\n      <span class="resource-points-count">${y(o)}</span>`;
    const c = l.querySelector("input");
    return c.addEventListener("change",() => i(c.checked)),l
  }function C(e,t,n){
    const a = new Set(d[e]);
    n ?a.add(t):a.delete(t),d[e] = [...a].sort((e,t) => e - t),b(),P(),B()
  }function G(){
    l.portalLayer.innerHTML = "",l.togglePortalsButton.setAttribute("aria-pressed",String(d.portalsVisible)),l.togglePortalsButton.classList.toggle("is-active",!d.portalsVisible),l.togglePortalsButton.title = d.portalsVisible ?"Скрыть входы на подробные карты":"Показать входы на подробные карты",l.togglePortalsLabel.textContent = d.portalsVisible ?"Скрыть карты":"Показать карты","world" === g.currentMapId && d.portalsVisible && i.forEach(e => {
      const t = document.createElement("button");
      t.type = "button",t.className = "portal-marker",H(t,e.entrance.x,e.entrance.y),t.dataset.label = e.name,t.setAttribute("aria-label",`Открыть карту: ${e.name}`),t.textContent = "+",t.addEventListener("pointerdown",e => e.stopPropagation()),t.addEventListener("click",t => {
        t.stopPropagation(),N(e.id)
      }),l.portalLayer.append(t)
    })
  }function q(){
    cancelAnimationFrame(p),p = requestAnimationFrame(B)
  }function B(){
    cancelAnimationFrame(p),p = 0,l.markerLayer.innerHTML = "";
    const e = l.mapViewport.getBoundingClientRect(),t = 80 / g.scale,n =  - g.panX / g.scale - t,a =  - g.panY / g.scale - t,o = (e.width - g.panX) / g.scale + t,r = (e.height - g.panY) / g.scale + t,s = k().map(S).filter(Boolean).filter(e => e.displayX >= n && e.displayX <= o && e.displayY >= a && e.displayY <= r),i = g.scale < Math.min(1,.72 * g.maxScale),d = 34 / g.scale,m = new Map;
    s.forEach(e => {
      const t = E(e),n = i && e.id !== g.selectedPointId ?`${t.id}:${Math.floor(e.displayX/d)}:${Math.floor(e.displayY/d)}`:`selected-${e.id}`;
      m.has(n) || m.set(n,[]),m.get(n).push(e)
    }),m.forEach(e => {
      1 === e.length ?function(e){
        const t = c.resources[e.resourceIndex],n = c.zones[e.zoneIndex],a = document.createElement("button");
        a.type = "button",a.className = "resource-marker" + (g.selectedPointId === e.id ?" is-selected":""),H(a,e.displayX,e.displayY),a.style.setProperty("--marker-color",t.color),a.textContent = t.symbol,a.title = `${t.name} · ${n.name} · Ур. ${c.bands[e.bandIndex]}`,a.setAttribute("aria-label",a.title),a.addEventListener("pointerdown",e => e.stopPropagation()),a.addEventListener("click",t => {
          t.stopPropagation(),Y(e.id)
        }),l.markerLayer.append(a)
      }(e[0]):function(e){
        const t = e.reduce((e,t) => e + t.displayX,0) / e.length,n = e.reduce((e,t) => e + t.displayY,0) / e.length,a = E(e[0]),o = document.createElement("button");
        o.type = "button",o.className = `cluster-marker cluster-${a.id}`,H(o,t,n),o.style.setProperty("--marker-color",a.color),o.textContent = e.length > 999 ?"999+":String(e.length),o.title = `${a.name}: ${e.length} точек рядом`,o.setAttribute("aria-label",o.title),o.addEventListener("pointerdown",e => e.stopPropagation()),o.addEventListener("click",a => {
          a.stopPropagation(),g.scale < .72 * g.maxScale ?T(t,n,Math.min(g.maxScale,Math.max(2.15 * g.scale,.55))):function(e){
            g.selectedPointId = null,l.detailsEyebrow.textContent = "Точки рядом";
            const t = [...e].sort((e,t) => c.resources[e.resourceIndex].name.localeCompare(c.resources[t.resourceIndex].name,"ru") || c.zones[e.zoneIndex].name.localeCompare(c.zones[t.zoneIndex].name,"ru"));
            l.detailsContent.innerHTML = `\n      <div class="cluster-drawer-title"><h2>${y(e.length)} точек рядом</h2><p>Выберите нужный ресурс</p></div>\n      <div class="cluster-point-list">${t.map(e=>{const t=c.resources[e.resourceIndex],n=c.zones[e.zoneIndex];return` < button type = "button" data - point - id = "${e.id}" style = "--marker-color:${f(t.color)}" > \n < span > $ {
              f(t.symbol)
            } <  / span >  < span >  < strong > $ {
              f(t.name)
            } <  / strong >  < small > $ {
              f(n.name)
            }·Ур.$ {
              f(c.bands[e.bandIndex])
            } <  / small >  <  / span >  < i > › <  / i > \n <  / button > `}).join("")}</div>`,l.detailsDrawer.classList.add("is-open"),l.detailsDrawer.setAttribute("aria-hidden","false"),l.detailsContent.querySelectorAll("[data-point-id]").forEach(e => {
              e.addEventListener("click",() => {
                const t = Number(e.dataset.pointId),n = w(c.points[t]);
                T(n.x,n.y,Math.max(g.scale,1.3)),Y(t)
              })
            })
          }(e)
        }),l.markerLayer.append(o)
      }(e)
    })
  }function H(e,t,n){
    e.dataset.mapX = String(t),e.dataset.mapY = String(n),e.style.left = `${A(g.panX+t*g.scale)}px`,e.style.top = `${A(g.panY+n*g.scale)}px`
  }function A(e){
    const t = window.devicePixelRatio || 1;
    return Math.round(e * t) / t
  }function W({
    rerender:e = !0
  } = {
  }){
    l.mapStage.style.transform = `translate3d(${g.panX}px, ${g.panY}px, 0) scale(${g.scale})`,l.mapStage.classList.toggle("is-upscaled",g.scale >= 1),l.zoomStatus.textContent = `${Math.round(100*g.scale)}%`,l.portalLayer.querySelectorAll("[data-map-x]").forEach(e => {
      e.style.left = `${A(g.panX+Number(e.dataset.mapX)*g.scale)}px`,e.style.top = `${A(g.panY+Number(e.dataset.mapY)*g.scale)}px`
    }),l.markerLayer.querySelectorAll("[data-map-x]").forEach(e => {
      e.style.left = `${A(g.panX+Number(e.dataset.mapX)*g.scale)}px`,e.style.top = `${A(g.panY+Number(e.dataset.mapY)*g.scale)}px`
    }),e && q()
  }function D(){
    "world" === g.currentMapId ?function(){
      const e = l.mapViewport.getBoundingClientRect();
      if (!e.width || !e.height)return;
      const t = Math.min((e.width - 34) / a,(e.height - 34) / o);
      g.minScale = Math.max(.025,.55 * t),g.maxScale = Math.max(3,12 * t),g.scale = Math.min(g.maxScale,Math.max(g.minScale,.48)),g.panX = e.width / 2 - 1738 * g.scale,g.panY = e.height / 2 - 2482 * g.scale,W()
    }():function(){
      const e = l.mapViewport.getBoundingClientRect();
      if (!(e.width && e.height && g.width && g.height))return;
      const t = Math.min((e.width - 34) / g.width,(e.height - 34) / g.height);
      g.minScale = Math.max(.025,.55 * t),g.maxScale = Math.max(3,12 * t),g.scale = t,g.panX = (e.width - g.width * g.scale) / 2,g.panY = (e.height - g.height * g.scale) / 2,W()
    }()
  }function K(e,t,n){
    const a = l.mapViewport.getBoundingClientRect(),o = (t ?? a.left + a.width / 2) - a.left,r = (n ?? a.top + a.height / 2) - a.top,s = (o - g.panX) / g.scale,i = (r - g.panY) / g.scale;
    g.scale = Math.min(g.maxScale,Math.max(g.minScale,e)),g.panX = o - s * g.scale,g.panY = r - i * g.scale,W()
  }function T(e,t,n){
    const a = l.mapViewport.getBoundingClientRect();
    n && (g.scale = Math.min(g.maxScale,Math.max(g.minScale,n))),g.panX = a.width / 2 - e * g.scale,g.panY = a.height / 2 - t * g.scale,W()
  }function U(){
    g.currentMapId = "world",g.currentFloorId = null,X(),z(),O()
  }function N(e){
    const t = M(e);
    t && (g.currentMapId = t.id,g.currentFloorId = t.floors[0].id,X(),z(),O())
  }function z(){
    if ("world" === g.currentMapId)g.width = a,g.height = o,l.mapImage.src = "assets/world-map.png",l.mapImage.alt = "Радарная карта мира Lineage 2",l.placeholderLocationName.textContent = n;
    else {
      const e = x(),t = V();
      g.width = t.width,g.height = t.height,l.mapImage.src = t.asset,l.mapImage.alt = `Карта: ${e.name}, ${t.name}`,l.placeholderLocationName.textContent = e.name
    }l.mapImage.hidden = !1,l.dungeonPlaceholder.hidden = !0,l.mapStage.style.width = `${g.width}px`,l.mapStage.style.height = `${g.height}px`,l.mapOnboarding.hidden = d.onboardingDismissed || "world" !== g.currentMapId,function(){
      if ("world" === g.currentMapId)return l.currentMapName.textContent = n,l.breadcrumbSeparator.hidden = !0,void(l.backToWorldButton.hidden = !0);
      const e = x(),t = V();
      l.currentMapName.textContent = e?.floors.length > 1 ?`${e.name} · ${t.name}`:e?.name || "Локация",l.breadcrumbSeparator.hidden = !1,l.backToWorldButton.hidden = !1
    }(),function(){
      const e = x();
      l.floorSwitcher.innerHTML = "",!e || e.floors.length < 2 ?l.floorSwitcher.hidden = !0:(l.floorSwitcher.hidden = !1,e.floors.forEach(e => {
        const t = document.createElement("button");
        t.type = "button",t.className = e.id === g.currentFloorId ?"is-active":"",t.textContent = e.name,t.addEventListener("click",() => {
          e.id !== g.currentFloorId && (g.currentFloorId = e.id,X(),z())
        }),l.floorSwitcher.append(t)
      }))
    }(),P(),G(),B(),requestAnimationFrame(D)
  }function Y(e){
    const t = c.points[e];
    if (!t)return;
    const n = c.resources[t.resourceIndex],a = c.zones[t.zoneIndex];
    g.selectedPointId = t.id,l.detailsEyebrow.textContent = "Точка ресурса",l.detailsContent.innerHTML = `\n      <div class="detail-resource">\n        <span class="detail-symbol" style="--marker-color:${f(n.color)}">${f(n.symbol)}</span>\n        <div><h2>${f(n.name)}</h2><p>${f(a.name)}</p></div>\n      </div>\n      <div class="location-level-card">\n        <span>Диапазон ресурса</span>\n        <strong>Ур. ${f(c.bands[t.bandIndex])}</strong>\n        <small>Подходящий уровень локации</small>\n      </div>\n      <div class="drawer-actions drawer-actions-single">\n        <button class="toolbar-button primary" id="focusPointButton" type="button">Показать крупнее</button>\n      </div>`,l.detailsDrawer.classList.add("is-open"),l.detailsDrawer.setAttribute("aria-hidden","false"),l.detailsContent.querySelector("#focusPointButton").addEventListener("click",() => {
      const e = w(t);
      T(e.x,e.y,Math.max(g.scale,1.25))
    }),B()
  }function X(){
    g.selectedPointId = null,l.detailsDrawer.classList.remove("is-open"),l.detailsDrawer.setAttribute("aria-hidden","true"),q()
  }function O(){
    l.sidebar.classList.remove("is-open"),l.mobileScrim.hidden = !0
  }l.globalSearch.addEventListener("input",() => {
    m = l.globalSearch.value.trim().toLowerCase(),P(),B()
  }),l.worldMapButton.addEventListener("click",U),l.backToWorldButton.addEventListener("click",U),l.togglePortalsButton.addEventListener("click",() => {
    d.portalsVisible = !d.portalsVisible,b(),G()
  }),l.resetFiltersButton.addEventListener("click",function(){
    d.resources = [0,1,2],d.bands = [...r],m = "",l.globalSearch.value = "",b(),P(),B(),clearTimeout(u),l.toast.textContent = "Включены основные ресурсы",l.toast.classList.add("is-visible"),u = setTimeout(() => l.toast.classList.remove("is-visible"),2600)
  }),l.helpButton.addEventListener("click",() => l.helpDialog.showModal()),l.zoomInButton.addEventListener("click",() => K(1.3 * g.scale)),l.zoomOutButton.addEventListener("click",() => K(g.scale / 1.3)),l.closeDetails.addEventListener("click",X),l.openSidebar.addEventListener("click",function(){
    l.sidebar.classList.add("is-open"),l.mobileScrim.hidden = !1
  }),l.closeSidebar.addEventListener("click",O),l.mobileScrim.addEventListener("click",O),l.closeOnboarding.addEventListener("click",() => {
    d.onboardingDismissed = !0,b(),l.mapOnboarding.hidden = !0
  }),l.breadcrumbs.addEventListener("click",e => {
    e.target.closest("[data-breadcrumb='world']") && U()
  }),l.mapImage.addEventListener("error",() => {
    l.mapImage.hidden = !0,l.dungeonPlaceholder.hidden = !1
  }),l.mapViewport.addEventListener("wheel",e => {
    e.preventDefault();
    const t = Math.exp(.0014 *  - e.deltaY);
    K(g.scale * t,e.clientX,e.clientY)
  },{
    passive:!1
  }),l.floorSwitcher.addEventListener("wheel",e => {
    l.floorSwitcher.scrollWidth <= l.floorSwitcher.clientWidth || (e.preventDefault(),e.stopPropagation(),l.floorSwitcher.scrollLeft += e.deltaY || e.deltaX)
  },{
    passive:!1
  }),l.mapViewport.addEventListener("contextmenu",e => {
    "world" !== g.currentMapId && (e.preventDefault(),U())
  }),l.mapViewport.addEventListener("pointerdown",e => {
    0 !== e.button || e.target.closest("button, input") || (g.pointerId = e.pointerId,g.dragStartX = e.clientX,g.dragStartY = e.clientY,g.dragPanX = g.panX,g.dragPanY = g.panY,g.didDrag = !1,l.mapViewport.setPointerCapture(e.pointerId))
  }),l.mapViewport.addEventListener("pointermove",e => {
    if (g.pointerId !== e.pointerId)return;
    const t = e.clientX - g.dragStartX,n = e.clientY - g.dragStartY;
    Math.hypot(t,n) > 4 && (g.didDrag = !0),g.didDrag && (l.mapViewport.classList.add("is-dragging"),g.panX = g.dragPanX + t,g.panY = g.dragPanY + n,W({
      rerender:!1
    }))
  }),l.mapViewport.addEventListener("pointerup",e => {
    g.pointerId === e.pointerId && (l.mapViewport.releasePointerCapture(e.pointerId),l.mapViewport.classList.remove("is-dragging"),g.pointerId = null,q())
  }),l.mapViewport.addEventListener("pointercancel",() => {
    g.pointerId = null,l.mapViewport.classList.remove("is-dragging"),q()
  }),window.addEventListener("resize",D),window.addEventListener("mouseup",e => {
    3 === e.button && "world" !== g.currentMapId && (e.preventDefault(),U())
  },{
    capture:!0
  }),window.addEventListener("keydown",e => {
    if (("Escape" === e.key || "BrowserBack" === e.key || e.altKey && "ArrowLeft" === e.key) && "world" !== g.currentMapId)return e.preventDefault(),void U();
    "Escape" === e.key && X()
  }),(() => {
    const names = ["Руины Забвения","Озеро Спящих Вод","Руины Отчаяния","Мыс Камау","Муравейник","Рычащие Холмы","Тихая Гавань","Земли Страданий","Топи","Воющее Ущелье","Долина Статуй","Ущелье Драконов","Горный Хребет","Штормовой Предел","Пастбище","Море Спор","Земли Махумов","Башня Дерзости","Охотничьи Угодья","Кладбище","Озеро Нарсил","Земли Мертвых"];
    const cities = ["Глудин","Дион","Глудио","Хейн","Гиран","Орен","Деревня Охотников","Аден"];
    const rewards = ["Клей","Нить","Щебень","Краска","Уголь","Смола","Катализатор"];
    const routes = [[[0,73],[2,27]],[[0,10]],[[2,100]],[[0,38]],[[0,85]],[[1,93],[4,121]],[[1,10]],[[1,100],[4,21]],[[3,127]],[[2,73]],[[4,10]],[[4,127]],[[5,39],[6,93]],[[4,41]],[[5,9],[6,35]],[[5,21]],[[7,127]],[[5,91],[7,87]],[[6,42],[7,37]],[[7,82]],[[7,5]],[[7,41]]];
    const packed = Uint8Array.from(atob("hgYUyvf5AUsO527ePT8MBJDvGpLzS4ca90ym5iovecIHs3w50U30CDaXRFCTRLS0i4hXqSjsuJnumGJqfCFAH4aA1DdU4aIdBJzDJC6Orew0G+6p8v8Cqg=="),value => value.charCodeAt(0));
    let cipher = 0x6d2b79f5;
    for (let index = 0;
    index < packed.length;
    index += 1){
      cipher ^=cipher << 13;
      cipher ^=cipher >>> 17;
      cipher ^=cipher << 5;
      cipher >>>=0;
      packed[index]^=cipher & 255;
    }const coordinates = new DataView(packed.buffer);
    const outposts = names.map((name,index) => ({
      name,x:coordinates.getUint16(index * 4,true) / 8,y:coordinates.getUint16(index * 4 + 2,true) / 8,routes:routes[index]
    }));

    // Corrected exact in-game coordinates supplied for several caravan outposts.
    // The radar map uses the same calibrated world -> map projection as the
    // CaravanRoutingData.xml routes.
    const correctedOutpostGameCoordinates = new Map([
      ["Топи",[87568,204967,-3728]],
      ["Долина Статуй",[76661,123915,-2512]],
      ["Горный Хребет",[72958,106491,-1515]],
      ["Пастбище",[90041,77479,-3003]],
      ["Охотничьи Угодья",[133814,88935,-3419]],
      ["Море Спор",[70386,22441,-3435]]
    ]);
    const worldToRadar = (worldX,worldY) => ({
      x:0.00750184083 * Number(worldX) + 1436.63038,
      y:0.00746632039 * Number(worldY) + 1962.75598
    });
    outposts.forEach(outpost => {
      const corrected = correctedOutpostGameCoordinates.get(outpost.name);
      if (!corrected)return;
      const point = worldToRadar(corrected[0],corrected[1]);
      outpost.x = point.x;
      outpost.y = point.y;
      outpost.gameX = corrected[0];
      outpost.gameY = corrected[1];
      outpost.gameZ = corrected[2];
    });
    packed.fill(0);
    const bossSpecs = [["Искусительница Душ",55,3],["Вожак Банды Акуи",55,3],["Лоскутень",55,4],["Волколак",55,4],["Одержимое Пугало",55,4],["Лидер Кроков",65,4],["Повелитель Усопших",65,3],["Боевой Медведь Бирнисон",65,3],["Гимриет",65,3],["Обжора",65,3],["Хозяйка Ночи",65,4],["Вознесшийся",75,1],["Палоди",75,1],["Остывший Лавазавр",75,3],["Владычица Тени",75,3],["Эксперимент № А1803-1",75,3],["Кукловод",75,3],["Древесная Нимфа",75,3]];
    const bossPacked = Uint8Array.from(atob("+iQgyJ35F+n1YFyT3T6pLzbhVl6pzAxdhaES2ai6BBFj5RwNFeEEHq9PKlwxUW0KvqqAqxEez89MCSxMxKf9EBhkkXhBlAMwaqWsV1JYLseLFOE9o2Q5JHATF2oLGw9KzNFLXHbuOmh5crwKSA8MK77Az6gtCgOKcwLkZkrvvw6N++KJ/x4AdddRekHo4JPyEHiIckn1m8V/x/5DT3g7CigNoxUe1gkueid/gpPcopcQV2yly+RAG1Iq9RGVaQ6lmgvZNAxOVfQWYwyyBCRtlbVlnYEom/p7k98TBw=="),value => value.charCodeAt(0));
    let bossCipher = 0x51f15e37;
    for (let index = 0;
    index < bossPacked.length;
    index += 1){
      bossCipher ^=bossCipher << 13;
      bossCipher ^=bossCipher >>> 17;
      bossCipher ^=bossCipher << 5;
      bossCipher >>>=0;
      bossPacked[index]^=bossCipher & 255;
    }const bossCoordinates = new DataView(bossPacked.buffer);
    let bossPointIndex = 0;
    const bosses = bossSpecs.map((spec,index) => {
      const points = [];
      for (let point = 0;
      point < spec[2];
      point += 1){
        points.push({
          x:bossCoordinates.getUint16(bossPointIndex * 4,true) / 8,y:bossCoordinates.getUint16(bossPointIndex * 4 + 2,true) / 8
        });
        bossPointIndex += 1;
      }return {
        name:spec[0],level:spec[1],points,index
      };
    });
    bossPacked.fill(0);
    let squadWikiByName = new Map();
    const squadNameKey = value => String(value ?? '').toLocaleLowerCase('ru-RU').replace(/ё/g,'е').replace(/[«»“”„"\'`]/g,'').replace(/№\s*/g,'№').replace(/\s+/g,' ').trim();
    function applySquadWiki(data){
      const items = Array.isArray(data?.items) ? data.items : [];
      squadWikiByName = new Map(items.map(item => [squadNameKey(item?.name), item]));
      bosses.forEach(boss => { boss.wiki = squadWikiByName.get(squadNameKey(boss.name)) || null; });
    }

    const raidBosses = (Array.isArray(window.ODIUM_RAID_BOSSES) ? window.ODIUM_RAID_BOSSES : []).map((spec,index) => ({
      ...spec,
      index,
      points:(Array.isArray(spec.points) ? spec.points : []).map(point => ({
        ...point,
        ...worldToRadar(point.worldX,point.worldY),
      })),
    }));
    let raidBossWikiByName = new Map();
    function applyRaidBossWiki(data){
      const items = Array.isArray(data?.items) ? data.items : [];
      raidBossWikiByName = new Map(items.map(item => [squadNameKey(item?.name), item]));
      raidBosses.forEach(boss => {
        boss.wiki = raidBossWikiByName.get(squadNameKey(boss.name)) || null;
      });
    }
    const activeBossLevels = new Set([55,65,75]);
    const activeRaidBossLevels = new Set([55,65,68,75,78]);
    let showBossLabels = false;
    let showRaidBossLabels = false;
    let mode = "resources";
    const tabs = document.createElement("nav");
    tabs.className = "mode-tabs";
    tabs.setAttribute("aria-label","Разделы приложения");
    tabs.innerHTML = '<button type="button" data-mode="resources"><span>✦</span>Карта ресурсов</button><button type="button" data-mode="caravan"><span>♜</span>Караванные ресурсы</button><button type="button" data-mode="squads"><span>⚔</span>Сквады</button><button type="button" data-mode="raid-bosses"><span>♛</span>Рейдовые боссы</button>';
    document.querySelector(".workspace").prepend(tabs);
    const caravanLayer = document.createElement("div");
    caravanLayer.id = "caravanLayer";
    caravanLayer.className = "caravan-layer";
    l.mapViewport.append(caravanLayer);
    const caravanRouteLayer = document.createElementNS("http://www.w3.org/2000/svg","svg");
    caravanRouteLayer.id = "caravanAutoRouteLayer";
    caravanRouteLayer.classList.add("caravan-auto-route-layer");
    caravanRouteLayer.setAttribute("viewBox","0 0 3168 4096");
    caravanRouteLayer.setAttribute("width","3168");
    caravanRouteLayer.setAttribute("height","4096");
    caravanRouteLayer.setAttribute("preserveAspectRatio","none");
    // Keep the automatic caravan layer self-contained. resource-map.html loads
    // styles.css, while older experimental app.css is not part of this page.
    // Explicit positioning here prevents the SVG from falling into normal
    // document flow below the 4096px map image.
    caravanRouteLayer.style.position = "absolute";
    caravanRouteLayer.style.inset = "0";
    caravanRouteLayer.style.width = "3168px";
    caravanRouteLayer.style.height = "4096px";
    caravanRouteLayer.style.zIndex = "6";
    caravanRouteLayer.style.overflow = "visible";
    caravanRouteLayer.style.pointerEvents = "none";
    l.mapStage.insertBefore(caravanRouteLayer,l.mapStage.querySelector("#routeLayer"));
    const bossLayer = document.createElement("div");
    bossLayer.id = "bossLayer";
    bossLayer.className = "boss-layer";
    l.mapViewport.append(bossLayer);
    const raidBossLayer = document.createElement("div");
    raidBossLayer.id = "raidBossLayer";
    raidBossLayer.className = "raid-boss-layer";
    l.mapViewport.append(raidBossLayer);
    const caravanSidebar = document.createElement("section");
    caravanSidebar.className = "caravan-sidebar";
    caravanSidebar.innerHTML = '<div class="section-heading"><span>Аванпосты</span><span class="counter" id="outpostCount">22</span></div><div class="outpost-list" id="outpostList"></div>';
    l.sidebar.querySelector(".sidebar-scroll").append(caravanSidebar);
    const squadSidebar = document.createElement("section");
    squadSidebar.className = "squad-sidebar";
    squadSidebar.innerHTML = '<div class="boss-filter-block"><div class="section-heading"><span>Фильтры</span><span class="counter">3</span></div><div class="boss-level-filters" id="bossLevelFilters"><button type="button" class="is-active" data-level="55" aria-pressed="true"><strong>55</strong><small>18 точек</small></button><button type="button" class="is-active" data-level="65" aria-pressed="true"><strong>65</strong><small>20 точек</small></button><button type="button" class="is-active" data-level="75" aria-pressed="true"><strong>75</strong><small>17 точек</small></button></div></div><div class="boss-display-block"><div class="section-heading"><span>Отображение</span></div><button type="button" class="boss-display-toggle" id="bossLabelsToggle" aria-pressed="false"><span class="boss-toggle-check">✓</span><span><strong>Подписи на карте</strong><small>Имя и уровень сквада</small></span></button></div><div class="boss-list-head section-heading"><span>СКВАДЫ</span><span class="counter" id="bossCount">18</span></div><div class="boss-list" id="bossList"></div><div class="squad-update-box"><button type="button" class="text-button full-width" id="squadUpdateButton">Обновить данные сквадов</button><small id="squadUpdateStatus">Подробные данные: встроенная база</small></div>';
    l.sidebar.querySelector(".sidebar-scroll").append(squadSidebar);
    const raidBossSidebar = document.createElement("section");
    raidBossSidebar.className = "raid-boss-sidebar";
    const raidLevelPointCount = level => raidBosses.filter(boss => boss.level === level).reduce((sum,boss) => sum + boss.points.length,0);
    raidBossSidebar.innerHTML = '<div class="boss-filter-block"><div class="section-heading"><span>Фильтры</span><span class="counter">5</span></div><div class="boss-level-filters raid-boss-level-filters" id="raidBossLevelFilters">'
      + [55,65,68,75,78].map(level => '<button type="button" class="is-active" data-level="' + level + '" aria-pressed="true"><strong>' + level + '</strong><small>' + raidLevelPointCount(level) + ' точек</small></button>').join('')
      + '</div></div><div class="boss-display-block"><div class="section-heading"><span>Отображение</span></div><button type="button" class="boss-display-toggle raid-boss-display-toggle" id="raidBossLabelsToggle" aria-pressed="false"><span class="boss-toggle-check">✓</span><span><strong>Подписи на карте</strong><small>Имя и уровень рейдового босса</small></span></button></div><div class="boss-list-head section-heading"><span>РЕЙДОВЫЕ БОССЫ</span><span class="counter" id="raidBossCount">' + raidBosses.length + '</span></div><div class="boss-list raid-boss-list" id="raidBossList"></div><div class="squad-update-box"><button type="button" class="text-button full-width" id="raidBossUpdateButton">Обновить данные рейдовых боссов</button><small id="raidBossUpdateStatus">Подробные данные: встроенная база</small></div>';
    l.sidebar.querySelector(".sidebar-scroll").append(raidBossSidebar);
    const outpostList = caravanSidebar.querySelector("#outpostList");
    const outpostCount = caravanSidebar.querySelector("#outpostCount");
    const bossList = squadSidebar.querySelector("#bossList");
    const bossCount = squadSidebar.querySelector("#bossCount");
    const bossLevelFilters = squadSidebar.querySelector("#bossLevelFilters");
    const bossLabelsToggle = squadSidebar.querySelector("#bossLabelsToggle");
    const squadUpdateButton = squadSidebar.querySelector("#squadUpdateButton");
    const squadUpdateStatus = squadSidebar.querySelector("#squadUpdateStatus");
    const raidBossList = raidBossSidebar.querySelector("#raidBossList");
    const raidBossCount = raidBossSidebar.querySelector("#raidBossCount");
    const raidBossLevelFilters = raidBossSidebar.querySelector("#raidBossLevelFilters");
    const raidBossLabelsToggle = raidBossSidebar.querySelector("#raidBossLabelsToggle");
    const raidBossUpdateButton = raidBossSidebar.querySelector("#raidBossUpdateButton");
    const raidBossUpdateStatus = raidBossSidebar.querySelector("#raidBossUpdateStatus");
    const brandSubtitle = l.sidebar.querySelector(".brand-copy span");
    const caravanTownKeys = ["GLUDIN","DION","GLUDIO","HEINE","GIRAN","OREN","HUNTERS_VILLAGE","ADEN"];
    const caravanRouteKeys = [
      "ruins_of_oblivion","lake_of_sleeping_waters","ruins_of_despair","cape_kamau","anthill",
      "howling_hills","a_quiet_harbor","lands_of_suffering","swamp","howling_gorge",
      "valley_of_statues","dragon_territory","mountain_range","storm_limit","pasture",
      "sea_dispute","mahama_lands","tower_of_insolence","hunting_limit","cemetery",
      "lake_narsil","lands_of_the_dead"
    ];
    const caravanRouteColors = ["#e6b85d","#73b9e6","#d8815f","#8fd177","#c592e7","#e9d06d","#78d2c5","#e887ad"];
    let selectedCaravanOutpost = null;

    function caravanRouteRecord(outpost,cityIndex){
      if (!caravanRoutingData?.towns)return null;
      const outpostIndex = outposts.indexOf(outpost);
      if (outpostIndex < 0)return null;
      const townKey = caravanTownKeys[cityIndex];
      const routeKey = caravanRouteKeys[outpostIndex];
      const points = caravanRoutingData.towns?.[townKey]?.[routeKey];
      return Array.isArray(points) && points.length > 1 ? {townKey,routeKey,points} : null;
    }
    function projectCaravanRoute(points,outpost){
      if (!points?.length)return [];
      const sx = 0.00750184083, sy = 0.00746632039;
      const bx = 1436.63038, by = 1962.75598;
      const base = points.map(point => ({x:sx * Number(point[0]) + bx,y:sy * Number(point[1]) + by}));
      const end = base[base.length - 1];
      const dx = outpost.x - end.x, dy = outpost.y - end.y;
      const divisor = Math.max(1,base.length - 1);
      return base.map((point,index) => {
        const t = index / divisor;
        // Preserve the route start at the source town and progressively apply
        // the endpoint correction toward the outpost.
        const eased = t * t * (3 - 2 * t);
        return {x:point.x + dx * eased,y:point.y + dy * eased};
      });
    }
    function clearCaravanRoutes(){
      selectedCaravanOutpost = null;
      caravanRouteLayer.replaceChildren();
      caravanLayer.querySelectorAll(".caravan-marker.is-selected").forEach(marker => marker.classList.remove("is-selected"));
      outpostList.querySelectorAll(".outpost-item.is-selected").forEach(item => item.classList.remove("is-selected"));
    }
    function renderCaravanRoutes(outpost){
      caravanRouteLayer.replaceChildren();
      selectedCaravanOutpost = outpost;
      if (!outpost)return;
      const svgNS = "http://www.w3.org/2000/svg";
      outpost.routes.forEach(route => {
        const record = caravanRouteRecord(outpost,route[0]);
        if (!record)return;
        const points = projectCaravanRoute(record.points,outpost);
        if (points.length < 2)return;
        const color = caravanRouteColors[route[0] % caravanRouteColors.length];
        const pointString = points.map(point => `${point.x.toFixed(2)},${point.y.toFixed(2)}`).join(" ");

        const halo = document.createElementNS(svgNS,"polyline");
        halo.setAttribute("points",pointString);
        halo.setAttribute("fill","none");
        halo.setAttribute("stroke","rgba(0,0,0,.78)");
        halo.setAttribute("stroke-width","8");
        halo.setAttribute("stroke-linejoin","round");
        halo.setAttribute("stroke-linecap","round");
        halo.setAttribute("vector-effect","non-scaling-stroke");
        caravanRouteLayer.append(halo);

        const line = document.createElementNS(svgNS,"polyline");
        line.setAttribute("points",pointString);
        line.setAttribute("fill","none");
        line.setAttribute("stroke",color);
        line.setAttribute("stroke-width","3");
        line.setAttribute("stroke-linejoin","round");
        line.setAttribute("stroke-linecap","round");
        line.setAttribute("vector-effect","non-scaling-stroke");
        line.classList.add("caravan-auto-route-line");
        caravanRouteLayer.append(line);

        const start = points[0];
        const dot = document.createElementNS(svgNS,"circle");
        dot.setAttribute("cx",String(start.x));
        dot.setAttribute("cy",String(start.y));
        dot.setAttribute("r","5");
        dot.setAttribute("fill",color);
        dot.setAttribute("stroke","#11150f");
        dot.setAttribute("stroke-width","2");
        dot.setAttribute("vector-effect","non-scaling-stroke");
        caravanRouteLayer.append(dot);
      });
      caravanLayer.querySelectorAll(".caravan-marker").forEach(marker => marker.classList.toggle("is-selected",marker.getAttribute("aria-label") === outpost.name));
      outpostList.querySelectorAll(".outpost-item").forEach(item => item.classList.toggle("is-selected",item.dataset.outpostName === outpost.name));
    }
    function rewardNames(mask){
      return rewards.filter((name,index) => mask & (1 << index));
    }function rewardIcons(mask){
      return rewards.map((name,index) => mask & (1 << index)?'<span class="caravan-reward"><i class="caravan-icon r' + index + '"></i><b>' + f(name) + '</b></span>':"").join("");
    }function openOutpost(outpost){
      renderCaravanRoutes(outpost);
      const routeCards = outpost.routes.map(route => {
        const color = caravanRouteColors[route[0] % caravanRouteColors.length];
        const available = Boolean(caravanRouteRecord(outpost,route[0]));
        return '<article class="caravan-route' + (available ? '' : ' is-unavailable') + '"><span>Город</span><strong><i class="caravan-route-swatch" style="--route-color:' + color + '"></i>' + f(cities[route[0]]) + '</strong><small>' + (available ? 'Маршрут отображён на карте' : 'Нет координат маршрута') + '</small><div class="caravan-rewards">' + rewardIcons(route[1]) + "</div></article>";
      }).join("");
      l.detailsEyebrow.textContent = "Караванный аванпост";
      l.detailsContent.innerHTML = '<div class="caravan-detail-head"><span class="caravan-detail-tower"></span><div><h2>' + f(outpost.name) + '</h2><p>Маршруты и доступные типы наград</p></div></div><div class="caravan-routes">' + routeCards + "</div>";
      l.detailsDrawer.classList.add("is-open");
      l.detailsDrawer.setAttribute("aria-hidden","false");
    }function formatSquadNumber(value){
      const number = Number(value);
      if (!Number.isFinite(number))return f(value ?? '—');
      return new Intl.NumberFormat('ru-RU',{maximumFractionDigits:2}).format(number);
    }function squadInfoCard(label,value){
      if (value == null || value === '')return '';
      return '<div><span>' + f(label) + '</span><strong>' + f(value) + '</strong></div>';
    }function squadSection(title,body,extraClass=''){
      if (!body)return '';
      return '<section class="squad-detail-section ' + extraClass + '"><h3>' + f(title) + '</h3>' + body + '</section>';
    }function squadDropQuantity(drop){
      const min = Number(drop?.minCount), max = Number(drop?.maxCount);
      const hasMin = Number.isFinite(min), hasMax = Number.isFinite(max);
      if (hasMin && hasMax)return min === max ? '×' + formatSquadNumber(min) : '×' + formatSquadNumber(min) + '–' + formatSquadNumber(max);
      if (hasMin)return '×' + formatSquadNumber(min);
      if (hasMax)return '×' + formatSquadNumber(max);
      return '—';
    }function squadDropChance(drop){
      const chance = Number(drop?.chancePercent);
      if (!Number.isFinite(chance))return '—';
      const decimals = chance >= 10 ? 2 : chance >= 1 ? 3 : 4;
      return chance.toLocaleString('ru-RU',{maximumFractionDigits:decimals}) + '%';
    }function openBoss(boss){
      const pointWord = boss.points.length === 1 ?'точка':boss.points.length < 5 ?'точки':'точек';
      const wiki = boss.wiki || squadWikiByName.get(squadNameKey(boss.name)) || null;
      const level = Number(wiki?.level || boss.level) || boss.level;
      l.detailsEyebrow.textContent = 'Сквад';
      let html = '<div class="boss-detail-head"><span class="boss-detail-icon"><i></i></span><div><h2>' + f(boss.name) + '</h2><p>Сквад · уровень ' + level + '</p></div></div>';
      html += '<div class="boss-info-grid">' + squadInfoCard('Уровень',level) + squadInfoCard('Точек на карте',boss.points.length + ' ' + pointWord) + '</div>';

      if (wiki && wiki.sourceKind === 'wiki'){
        const main = wiki.mainInfo || {};
        const infoCards = [
          ['ID',wiki.id],['Тип',main.type],['Титул',main.title],['Раса',main.race],['Фракция',main.faction],
          ['Агрессивный',main.aggressive],['Радиус агрессии',main.aggroRange],['Респаун',main.respawnTime]
        ].map(([label,value]) => squadInfoCard(label,value)).join('');
        if (wiki.description)html += squadSection('Основная информация','<p class="squad-description">' + f(wiki.description) + '</p>' + (infoCards ? '<div class="squad-mini-grid">' + infoCards + '</div>' : ''));
        else if (infoCards)html += squadSection('Основная информация','<div class="squad-mini-grid">' + infoCards + '</div>');

        const statLabels = {hp:'HP',mp:'MP',patk:'Физ. атака',matk:'Маг. атака',pdef:'Физ. защита',mdef:'Маг. защита',atkSpd:'Скор. атаки',castSpd:'Скор. магии',moveSpd:'Скор. бега',accuracy:'Точность',evasion:'Уклонение',crit:'Крит. шанс'};
        const statCards = Object.entries(wiki.stats || {}).map(([key,value]) => squadInfoCard(statLabels[key] || key,formatSquadNumber(value))).join('');
        if (statCards)html += squadSection('Базовые характеристики','<div class="squad-mini-grid">' + statCards + '</div>');

        const rewardLabels = {exp:'Опыт',sp:'SP',raidPoints:'Рейдовые очки',adena:'Адена'};
        const rewardCards = Object.entries(wiki.rewards || {}).map(([key,value]) => squadInfoCard(rewardLabels[key] || key,formatSquadNumber(value))).join('');
        if (rewardCards)html += squadSection('Награды','<div class="squad-mini-grid">' + rewardCards + '</div>');

        const drops = Array.isArray(wiki.drops) ? wiki.drops : [];
        if (drops.length){
          const rows = drops.map(drop => {
            const icon = drop.icon
              ? '<span class="squad-drop-icon"><img src="' + f(drop.icon) + '" alt="" loading="lazy"></span>'
              : '<span class="squad-drop-icon is-empty" aria-hidden="true">◇</span>';
            const additional = drop.additionalName
              ? '<em class="squad-drop-additional">' + f(drop.additionalName) + '</em>'
              : '';
            return '<article class="squad-drop-row"><div class="squad-drop-item">' + icon + '<span class="squad-drop-copy"><strong>' + f(drop.name || 'Предмет') + '</strong>' + additional + '<small>' + f(drop.kind || 'Дроп') + '</small></span></div><span class="squad-drop-chance">' + f(squadDropChance(drop)) + '</span><span class="squad-drop-count">' + f(squadDropQuantity(drop)) + '</span></article>';
          }).join('');
          html += squadSection('Дроп','<div class="squad-drop-head"><span>Предмет</span><span>Шанс</span><span>Количество</span></div><div class="squad-drop-list">' + rows + '</div>','squad-drop-section');
        } else {
          const emptyDropMessage = wiki.dropDataStatus === 'empty'
            ? 'Wiki/API для этого босса возвращает пустой список дропа.'
            : 'В карточке Wiki не найден список дропа.';
          html += squadSection('Дроп','<p class="squad-empty-note">' + f(emptyDropMessage) + '</p>');
        }
      } else {
        html += squadSection('Данные Wiki','<p class="squad-empty-note">Подробные характеристики и дроп ещё не загружены. Используйте «Обновить данные сквадов» в левой панели.</p>');
      }
      l.detailsContent.innerHTML = html;
      l.detailsDrawer.classList.add('is-open');
      l.detailsDrawer.setAttribute('aria-hidden','false');
    }function focusOutpost(outpost){
      T(outpost.x,outpost.y,Math.max(g.scale,0.82));
      openOutpost(outpost);
      O();
    }function focusBoss(boss){
      const point = boss.points[0];
      T(point.x,point.y,Math.max(g.scale,0.82));
      openBoss(boss);
      O();
    }function renderOutposts(){
      const query = l.globalSearch.value.trim().toLowerCase();
      const filtered = outposts.filter(outpost => {
        const cityLine = outpost.routes.map(route => cities[route[0]]).join(" ");
        return !query || (outpost.name + " " + cityLine).toLowerCase().includes(query);
      });
      outpostCount.textContent = String(filtered.length);
      l.filterSummary.textContent = "Показано " + filtered.length + " из " + outposts.length;
      outpostList.innerHTML = "";
      caravanLayer.innerHTML = "";
      filtered.forEach(outpost => {
        const cityLine = outpost.routes.map(route => cities[route[0]]).join(" · ");
        const unionMask = outpost.routes.reduce((mask,route) => mask | route[1],0);
        const marker = document.createElement("button");
        marker.type = "button";
        marker.className = "caravan-marker";
        marker.dataset.mapX = String(outpost.x);
        marker.dataset.mapY = String(outpost.y);
        marker.setAttribute("aria-label",outpost.name);
        marker.innerHTML = '<span class="caravan-tower"></span><span class="caravan-label">' + f(outpost.name) + '</span><span class="caravan-peek"><strong>' + f(outpost.name) + '</strong><small>' + f(cityLine) + '</small><em>' + f(rewardNames(unionMask).join(" · ")) + "</em></span>";
        marker.addEventListener("click",() => openOutpost(outpost));
        caravanLayer.append(marker);
        const item = document.createElement("button");
        item.type = "button";
        item.className = "outpost-item";
        item.dataset.outpostName = outpost.name;
        item.innerHTML = '<span class="outpost-thumb"></span><span><strong>' + f(outpost.name) + '</strong><small>' + f(cityLine) + '</small></span><i>›</i>';
        item.addEventListener("click",() => focusOutpost(outpost));
        outpostList.append(item);
      });
      if (selectedCaravanOutpost && filtered.includes(selectedCaravanOutpost)) {
        caravanLayer.querySelectorAll(".caravan-marker").forEach(marker => marker.classList.toggle("is-selected",marker.getAttribute("aria-label") === selectedCaravanOutpost.name));
        outpostList.querySelectorAll(".outpost-item").forEach(item => item.classList.toggle("is-selected",item.dataset.outpostName === selectedCaravanOutpost.name));
      }
      W({
        rerender:false
      });
    }function renderBosses(){
      const query = l.globalSearch.value.trim().toLowerCase();
      const filtered = bosses.filter(boss => activeBossLevels.has(boss.level) && (!query || boss.name.toLowerCase().includes(query)));
      const visiblePoints = filtered.reduce((count,boss) => count + boss.points.length,0);
      bossCount.textContent = String(filtered.length);
      l.filterSummary.textContent = "Показано " + visiblePoints + " из 55 точек";
      bossList.innerHTML = "";
      bossLayer.innerHTML = "";
      filtered.forEach(boss => {
        const item = document.createElement("button");
        item.type = "button";
        item.className = "boss-list-item";
        item.innerHTML = '<span class="boss-thumb"><i></i></span><span><strong>' + f(boss.name) + '</strong><small>Ур. ' + boss.level + ' · ' + boss.points.length + ' точек</small></span><em>›</em>';
        item.addEventListener("click",() => focusBoss(boss));
        bossList.append(item);
        boss.points.forEach(point => {
          const marker = document.createElement("button");
          marker.type = "button";
          marker.className = "boss-marker boss-level-" + boss.level;
          marker.dataset.mapX = String(point.x);
          marker.dataset.mapY = String(point.y);
          marker.setAttribute("aria-label",boss.name + ", уровень " + boss.level);
          marker.innerHTML = '<span class="boss-window"><i></i><b>' + boss.level + '</b></span><span class="boss-label"><strong>' + f(boss.name) + '</strong><small>Уровень ' + boss.level + "</small></span>";
          marker.addEventListener("click",() => openBoss(boss));
          bossLayer.append(marker);
        });
      });
      W({
        rerender:false
      });
    }

    function openRaidBoss(boss){
      const pointWord = boss.points.length === 1 ? 'точка' : boss.points.length < 5 ? 'точки' : 'точек';
      const wiki = boss.wiki || raidBossWikiByName.get(squadNameKey(boss.name)) || null;
      const level = Number(wiki?.level || boss.level) || boss.level;
      l.detailsEyebrow.textContent = 'Рейдовый босс';
      let html = '<div class="boss-detail-head raid-boss-detail-head"><span class="raid-boss-detail-icon"><i>♛</i></span><div><h2>' + f(boss.name) + '</h2><p>Рейдовый босс · уровень ' + level + '</p></div></div>';
      html += '<div class="boss-info-grid raid-boss-info-grid">' + squadInfoCard('Уровень',level) + squadInfoCard('Точек на карте',boss.points.length + ' ' + pointWord) + '</div>';

      if (wiki && wiki.sourceKind === 'wiki'){
        const main = wiki.mainInfo || {};
        const infoCards = [
          ['ID',wiki.id],['Тип',main.type],['Титул',main.title],['Раса',main.race],['Фракция',main.faction],
          ['Агрессивный',main.aggressive],['Радиус агрессии',main.aggroRange],['Респаун',main.respawnTime]
        ].map(([label,value]) => squadInfoCard(label,value)).join('');
        if (wiki.description)html += squadSection('Основная информация','<p class="squad-description">' + f(wiki.description) + '</p>' + (infoCards ? '<div class="squad-mini-grid">' + infoCards + '</div>' : ''));
        else if (infoCards)html += squadSection('Основная информация','<div class="squad-mini-grid">' + infoCards + '</div>');

        const statLabels = {hp:'HP',mp:'MP',patk:'Физ. атака',matk:'Маг. атака',pdef:'Физ. защита',mdef:'Маг. защита',atkSpd:'Скор. атаки',castSpd:'Скор. магии',moveSpd:'Скор. бега',accuracy:'Точность',evasion:'Уклонение',crit:'Крит. шанс'};
        const statCards = Object.entries(wiki.stats || {}).map(([key,value]) => squadInfoCard(statLabels[key] || key,formatSquadNumber(value))).join('');
        if (statCards)html += squadSection('Базовые характеристики','<div class="squad-mini-grid">' + statCards + '</div>');

        const rewardLabels = {exp:'Опыт',sp:'SP',raidPoints:'Рейдовые очки',adena:'Адена'};
        const rewardCards = Object.entries(wiki.rewards || {}).map(([key,value]) => squadInfoCard(rewardLabels[key] || key,formatSquadNumber(value))).join('');
        if (rewardCards)html += squadSection('Награды','<div class="squad-mini-grid">' + rewardCards + '</div>');

        const drops = Array.isArray(wiki.drops) ? wiki.drops : [];
        if (drops.length){
          const rows = drops.map(drop => {
            const icon = drop.icon
              ? '<span class="squad-drop-icon"><img src="' + f(drop.icon) + '" alt="" loading="lazy"></span>'
              : '<span class="squad-drop-icon is-empty" aria-hidden="true">◇</span>';
            const additional = drop.additionalName
              ? '<em class="squad-drop-additional">' + f(drop.additionalName) + '</em>'
              : '';
            return '<article class="squad-drop-row raid-drop-row"><div class="squad-drop-item">' + icon + '<span class="squad-drop-copy"><strong>' + f(drop.name || 'Предмет') + '</strong>' + additional + '<small>' + f(drop.kind || 'Дроп') + '</small></span></div><span class="squad-drop-chance">' + f(squadDropChance(drop)) + '</span><span class="squad-drop-count">' + f(squadDropQuantity(drop)) + '</span></article>';
          }).join('');
          html += squadSection('Дроп','<div class="squad-drop-head"><span>Предмет</span><span>Шанс</span><span>Количество</span></div><div class="squad-drop-list">' + rows + '</div>','squad-drop-section');
        } else {
          html += squadSection('Дроп','<p class="squad-empty-note">В карточке Wiki не найден список дропа.</p>');
        }
      } else {
        html += squadSection('Данные Wiki','<p class="squad-empty-note">Подробные характеристики и дроп ещё не загружены. Используйте «Обновить данные рейдовых боссов» в левой панели.</p>');
      }
      l.detailsContent.innerHTML = html;
      l.detailsDrawer.classList.add('is-open');
      l.detailsDrawer.setAttribute('aria-hidden','false');
    }

    function focusRaidBoss(boss){
      const point = boss.points[0];
      T(point.x,point.y,Math.max(g.scale,0.82));
      openRaidBoss(boss);
      O();
    }

    function renderRaidBosses(){
      const query = l.globalSearch.value.trim().toLowerCase();
      const filtered = raidBosses.filter(boss => activeRaidBossLevels.has(boss.level) && (!query || boss.name.toLowerCase().includes(query)));
      const visiblePoints = filtered.reduce((count,boss) => count + boss.points.length,0);
      const totalPoints = raidBosses.reduce((count,boss) => count + boss.points.length,0);
      raidBossCount.textContent = String(filtered.length);
      l.filterSummary.textContent = 'Показано ' + visiblePoints + ' из ' + totalPoints + ' точек';
      raidBossList.innerHTML = '';
      raidBossLayer.innerHTML = '';
      filtered.forEach(boss => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'boss-list-item raid-boss-list-item';
        item.innerHTML = '<span class="raid-boss-thumb"><i>♛</i></span><span><strong>' + f(boss.name) + '</strong><small>Ур. ' + boss.level + ' · ' + boss.points.length + ' ' + (boss.points.length === 1 ? 'точка' : 'точки') + '</small></span><em>›</em>';
        item.addEventListener('click',() => focusRaidBoss(boss));
        raidBossList.append(item);
        boss.points.forEach(point => {
          const marker = document.createElement('button');
          marker.type = 'button';
          marker.className = 'raid-boss-marker raid-boss-level-' + boss.level;
          marker.dataset.mapX = String(point.x);
          marker.dataset.mapY = String(point.y);
          marker.setAttribute('aria-label',boss.name + ', уровень ' + boss.level);
          marker.innerHTML = '<span class="raid-boss-window"><i>♛</i><b>' + boss.level + '</b></span><span class="raid-boss-label"><strong>' + f(boss.name) + '</strong><small>Уровень ' + boss.level + '</small></span>';
          marker.addEventListener('click',() => openRaidBoss(boss));
          raidBossLayer.append(marker);
        });
      });
      W({ rerender:false });
    }

    const originalTransform = W;
    W = options => {
      originalTransform(options);
      if (mode === "caravan")caravanLayer.querySelectorAll("[data-map-x]").forEach(marker => {
        marker.style.left = g.panX + Number(marker.dataset.mapX) * g.scale + "px";
        marker.style.top = g.panY + Number(marker.dataset.mapY) * g.scale + "px";
      });
      if (mode === "squads")bossLayer.querySelectorAll("[data-map-x]").forEach(marker => {
        marker.style.left = g.panX + Number(marker.dataset.mapX) * g.scale + "px";
        marker.style.top = g.panY + Number(marker.dataset.mapY) * g.scale + "px";
      });
      if (mode === "raid-bosses")raidBossLayer.querySelectorAll("[data-map-x]").forEach(marker => {
        marker.style.left = g.panX + Number(marker.dataset.mapX) * g.scale + "px";
        marker.style.top = g.panY + Number(marker.dataset.mapY) * g.scale + "px";
      });
    };
    function switchMode(nextMode){
      if (mode === "caravan" && nextMode !== "caravan")clearCaravanRoutes();
      mode = nextMode;
      document.body.dataset.odiumMode = nextMode;
      tabs.querySelectorAll("button").forEach(button => button.classList.toggle("is-active",button.dataset.mode === nextMode));
      X();
      l.globalSearch.value = "";
      l.globalSearch.placeholder = nextMode === "caravan" ? "Найти аванпост…" : nextMode === "squads" ? "Найти сквада…" : nextMode === "raid-bosses" ? "Найти рейдового босса…" : "Локация или ресурс…";
      l.togglePortalsButton.hidden = nextMode !== "resources";
      l.helpButton.hidden = nextMode !== "resources";
      U();
      if (nextMode === "caravan"){
        brandSubtitle.textContent = "Караванные ресурсы";
        l.currentMapName.textContent = "Караванные ресурсы";
        l.mapOnboarding.hidden = true;
        renderOutposts();
      } else if (nextMode === "squads"){
        brandSubtitle.textContent = "Сквады";
        l.currentMapName.textContent = "Сквады";
        l.mapOnboarding.hidden = true;
        renderBosses();
      } else if (nextMode === "raid-bosses"){
        brandSubtitle.textContent = "Рейдовые боссы";
        l.currentMapName.textContent = "Рейдовые боссы";
        l.mapOnboarding.hidden = true;
        renderRaidBosses();
      } else {
        brandSubtitle.textContent = "Карта ресурсов";
        l.mapOnboarding.hidden = d.onboardingDismissed;
        P();
        B();
      }requestAnimationFrame(() => W({
        rerender:false
      }));
    }tabs.addEventListener("click",event => {
      const button = event.target.closest("button[data-mode]");
      if (button && button.dataset.mode !== mode)switchMode(button.dataset.mode);
    });
    l.globalSearch.addEventListener("input",() => {
      if (mode === "caravan")renderOutposts();
      if (mode === "squads")renderBosses();
      if (mode === "raid-bosses")renderRaidBosses();
    });
    const squadUpdateDialog = document.createElement('dialog');
    squadUpdateDialog.className = 'modal squad-update-dialog';
    squadUpdateDialog.innerHTML = '<form method="dialog"><div class="modal-head"><div><span class="eyebrow">Odium World API</span><h2>Обновить данные сквадов</h2></div><button class="icon-button" value="cancel" aria-label="Закрыть">×</button></div><p class="squad-update-help">Bearer-токен необязателен. Оставьте поле пустым для обычного запроса; если Odium API потребует авторизацию, повторите обновление с токеном. Токен используется только для текущего запроса и не сохраняется.</p><label class="squad-token-field"><span>Bearer token <small>(необязательно)</small></span><input id="squadTokenInput" type="password" autocomplete="off" placeholder="Можно оставить пустым"></label><div class="squad-update-progress" id="squadUpdateProgress"></div><div class="modal-actions"><button class="toolbar-button secondary" value="cancel">Отмена</button><button class="toolbar-button primary" id="squadUpdateSubmit" type="button">Обновить</button></div></form>';
    document.body.append(squadUpdateDialog);
    const squadTokenInput = squadUpdateDialog.querySelector('#squadTokenInput');
    const squadUpdateSubmit = squadUpdateDialog.querySelector('#squadUpdateSubmit');
    const squadUpdateProgress = squadUpdateDialog.querySelector('#squadUpdateProgress');

    async function reloadSquadWiki(){
      try {
        const data = await window.odiumApp?.getSquadData?.();
        if (data)applySquadWiki(data);
        const status = await window.odiumApp?.getSquadStatus?.();
        if (status && squadUpdateStatus)squadUpdateStatus.textContent = status.detailedCount ? 'Подробные данные: ' + status.detailedCount + ' из ' + status.itemCount : 'Подробные данные ещё не загружены';
        if (mode === 'squads')renderBosses();
      } catch {}
    }
    squadUpdateButton?.addEventListener('click',() => {
      squadUpdateProgress.textContent = '';
      squadTokenInput.value = '';
      squadUpdateDialog.showModal();
      setTimeout(() => squadTokenInput.focus(),30);
    });
    squadUpdateSubmit?.addEventListener('click',async () => {
      const token = squadTokenInput.value.trim();
      squadUpdateSubmit.disabled = true;
      squadTokenInput.disabled = true;
      squadUpdateProgress.textContent = 'Загружаем данные…';
      try {
        const result = await window.odiumApp?.updateSquadData?.(token);
        squadUpdateProgress.textContent = result?.message || (result?.ok ? 'Готово.' : 'Не удалось обновить данные.');
        if (result?.ok){
          await reloadSquadWiki();
          setTimeout(() => { try { squadUpdateDialog.close(); } catch {} },700);
        }
      } catch (error) {
        squadUpdateProgress.textContent = 'Ошибка обновления: ' + (error?.message || error);
      } finally {
        squadUpdateSubmit.disabled = false;
        squadTokenInput.disabled = false;
      }
    });
    window.odiumApp?.onSquadProgress?.(payload => {
      if (!squadUpdateDialog.open)return;
      if (payload?.message)squadUpdateProgress.textContent = payload.message;
    });
    reloadSquadWiki();

    const raidBossUpdateDialog = document.createElement('dialog');
    raidBossUpdateDialog.className = 'modal squad-update-dialog';
    raidBossUpdateDialog.innerHTML = '<form method="dialog"><div class="modal-head"><div><span class="eyebrow">Odium World API</span><h2>Обновить данные рейдовых боссов</h2></div><button class="icon-button" value="cancel" aria-label="Закрыть">×</button></div><p class="squad-update-help">Bearer-токен необязателен. Оставьте поле пустым для обычного запроса; если Odium API потребует авторизацию, повторите обновление с токеном. Токен используется только для текущего запроса и не сохраняется.</p><label class="squad-token-field"><span>Bearer token <small>(необязательно)</small></span><input id="raidBossTokenInput" type="password" autocomplete="off" placeholder="Можно оставить пустым"></label><div class="squad-update-progress" id="raidBossUpdateProgress"></div><div class="modal-actions"><button class="toolbar-button secondary" value="cancel">Отмена</button><button class="toolbar-button primary" id="raidBossUpdateSubmit" type="button">Обновить</button></div></form>';
    document.body.append(raidBossUpdateDialog);
    const raidBossTokenInput = raidBossUpdateDialog.querySelector('#raidBossTokenInput');
    const raidBossUpdateSubmit = raidBossUpdateDialog.querySelector('#raidBossUpdateSubmit');
    const raidBossUpdateProgress = raidBossUpdateDialog.querySelector('#raidBossUpdateProgress');

    async function reloadRaidBossWiki(){
      try {
        const data = await window.odiumApp?.getRaidBossData?.();
        if (data)applyRaidBossWiki(data);
        const status = await window.odiumApp?.getRaidBossStatus?.();
        if (status && raidBossUpdateStatus)raidBossUpdateStatus.textContent = status.detailedCount ? 'Подробные данные: ' + status.detailedCount + ' из ' + status.itemCount : 'Подробные данные ещё не загружены';
        if (mode === 'raid-bosses')renderRaidBosses();
      } catch {}
    }
    raidBossUpdateButton?.addEventListener('click',() => {
      raidBossUpdateProgress.textContent = '';
      raidBossTokenInput.value = '';
      raidBossUpdateDialog.showModal();
      setTimeout(() => raidBossTokenInput.focus(),30);
    });
    raidBossUpdateSubmit?.addEventListener('click',async () => {
      const token = raidBossTokenInput.value.trim();
      raidBossUpdateSubmit.disabled = true;
      raidBossTokenInput.disabled = true;
      raidBossUpdateProgress.textContent = 'Загружаем данные…';
      try {
        const result = await window.odiumApp?.updateRaidBossData?.(token);
        raidBossUpdateProgress.textContent = result?.message || (result?.ok ? 'Готово.' : 'Не удалось обновить данные.');
        if (result?.ok){
          await reloadRaidBossWiki();
          setTimeout(() => { try { raidBossUpdateDialog.close(); } catch {} },700);
        }
      } catch (error) {
        raidBossUpdateProgress.textContent = 'Ошибка обновления: ' + (error?.message || error);
      } finally {
        raidBossUpdateSubmit.disabled = false;
        raidBossTokenInput.disabled = false;
      }
    });
    window.odiumApp?.onRaidBossProgress?.(payload => {
      if (!raidBossUpdateDialog.open)return;
      if (payload?.message)raidBossUpdateProgress.textContent = payload.message;
    });
    reloadRaidBossWiki();

    bossLevelFilters.addEventListener("click",event => {
      const button = event.target.closest("button[data-level]");
      if (!button)return;
      const level = Number(button.dataset.level);
      if (activeBossLevels.has(level))activeBossLevels.delete(level);
      else activeBossLevels.add(level);
      const active = activeBossLevels.has(level);
      button.classList.toggle("is-active",active);
      button.setAttribute("aria-pressed",String(active));
      renderBosses();
    });
    bossLabelsToggle.addEventListener("click",() => {
      showBossLabels = !showBossLabels;
      bossLabelsToggle.classList.toggle("is-on",showBossLabels);
      bossLabelsToggle.setAttribute("aria-pressed",String(showBossLabels));
      document.body.dataset.bossLabels = showBossLabels ?"on":"off";
    });
    raidBossLevelFilters.addEventListener("click",event => {
      const button = event.target.closest("button[data-level]");
      if (!button)return;
      const level = Number(button.dataset.level);
      if (activeRaidBossLevels.has(level))activeRaidBossLevels.delete(level);
      else activeRaidBossLevels.add(level);
      const active = activeRaidBossLevels.has(level);
      button.classList.toggle("is-active",active);
      button.setAttribute("aria-pressed",String(active));
      renderRaidBosses();
    });
    raidBossLabelsToggle.addEventListener("click",() => {
      showRaidBossLabels = !showRaidBossLabels;
      raidBossLabelsToggle.classList.toggle("is-on",showRaidBossLabels);
      raidBossLabelsToggle.setAttribute("aria-pressed",String(showRaidBossLabels));
      document.body.dataset.raidBossLabels = showRaidBossLabels ? "on" : "off";
    });
    tabs.querySelector('[data-mode="resources"]').classList.add("is-active");
    document.body.dataset.odiumMode = "resources";
    document.body.dataset.bossLabels = "off";
    document.body.dataset.raidBossLabels = "off";
  })(),P(),z()
})();


document.getElementById('menuButton')?.addEventListener('click', async () => {
  if (window.odiumApp?.goToMenu) { const ok = await window.odiumApp.goToMenu(); if (ok) return; }
  window.location.href = 'index.html';
});


// User-defined map routes. Kept outside the legacy map module so the routing
// feature remains isolated from resource filters and existing map behavior.
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  const ui = {
    toggle: $('routeToggleButton'), panel: $('routePanel'), close: $('closeRoutePanel'),
    layer: $('routeLayer'), viewport: $('mapViewport'), mapImage: $('mapImage'),
    select: $('routeSelect'), name: $('routeNameInput'), summary: $('routeSummary'), hint: $('routeModeHint'),
    add: $('newRouteButton'), draw: $('routeDrawButton'), undo: $('undoRoutePointButton'),
    clear: $('clearRouteButton'), remove: $('deleteRouteButton'), save: $('saveRoutesButton'),
    import: $('importRoutesButton'), error: $('routeErrorDialog'), errorMessage: $('routeErrorMessage')
  };
  if (!ui.toggle || !ui.layer || !ui.viewport) return;

  const ROUTE_FORMAT = 'odium-world-map-routes';
  const ROUTE_VERSION = 1;
  const palette = ['#f0b84f','#63c7ff','#79d36b','#ef7d78','#c693ff','#f28ecb','#80d8c6','#f0df6b'];
  let routes = [];
  let activeId = null;
  let placing = false;
  let press = null;

  const uid = () => `route-${Date.now().toString(36)}-${Math.random().toString(36).slice(2,8)}`;
  const esc = value => String(value ?? '').replace(/[&<>"']/g, ch => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[ch]));
  const activeRoute = () => routes.find(route => route.id === activeId) || null;
  const currentView = () => window.__odiumMapRouteApi?.getView?.() || {
    asset: ui.mapImage?.getAttribute('src') || 'assets/world-map.png', width: 3168, height: 4096
  };

  function showError(message = 'Невозможно загрузить маршрут') {
    if (ui.errorMessage) ui.errorMessage.textContent = message;
    if (ui.error?.showModal) ui.error.showModal();
  }
  function createRoute(name) {
    const route = { id: uid(), name: String(name || `Маршрут ${routes.length + 1}`).trim().slice(0,80) || `Маршрут ${routes.length + 1}`, color: palette[routes.length % palette.length], points: [] };
    routes.push(route); activeId = route.id; refreshUI(); render(); return route;
  }
  function ensureRoute() { return activeRoute() || createRoute(); }

  function refreshUI() {
    if (ui.select) {
      ui.select.innerHTML = routes.length ? routes.map(route => `<option value="${esc(route.id)}"${route.id === activeId ? ' selected' : ''}>${esc(route.name)}</option>`).join('') : '<option value="">Нет маршрутов</option>';
      ui.select.disabled = !routes.length;
    }
    const route = activeRoute();
    if (ui.name) { ui.name.value = route?.name || ''; ui.name.disabled = !route; }
    const totalPoints = routes.reduce((sum, item) => sum + item.points.length, 0);
    if (ui.summary) ui.summary.textContent = `Маршрутов: ${routes.length} · Точек: ${totalPoints}${route ? ` · В выбранном: ${route.points.length}` : ''}`;
    if (ui.hint) ui.hint.textContent = placing ? 'ЛКМ по карте добавляет точки' : 'Режим построения выключен';
    if (ui.draw) { ui.draw.classList.toggle('is-active', placing); ui.draw.setAttribute('aria-pressed', String(placing)); ui.draw.textContent = placing ? 'Завершить точки' : 'Ставить точки'; }
    [ui.undo, ui.clear, ui.remove].forEach(button => { if (button) button.disabled = !route; });
  }

  function segmentRoute(points, asset) {
    const segments = []; let current = [];
    for (const point of points) {
      if (point.asset === asset) current.push(point);
      else if (current.length) { segments.push(current); current = []; }
    }
    if (current.length) segments.push(current);
    return segments;
  }

  function render() {
    if (!ui.layer) return;
    const view = currentView();
    const width = Math.max(1, Number(view.width) || 1), height = Math.max(1, Number(view.height) || 1);
    ui.layer.setAttribute('viewBox', `0 0 ${width} ${height}`);
    ui.layer.setAttribute('width', String(width)); ui.layer.setAttribute('height', String(height));
    ui.layer.innerHTML = '';
    const ns = 'http://www.w3.org/2000/svg';
    for (const route of routes) {
      const segments = segmentRoute(route.points, view.asset);
      for (const segment of segments) {
        if (segment.length > 1) {
          const line = document.createElementNS(ns,'polyline');
          line.setAttribute('points', segment.map(p => `${p.x},${p.y}`).join(' '));
          line.setAttribute('fill','none'); line.setAttribute('stroke',route.color); line.setAttribute('stroke-width','4.2');
          line.setAttribute('stroke-linecap','round'); line.setAttribute('stroke-linejoin','round');
          line.setAttribute('vector-effect','non-scaling-stroke'); line.setAttribute('class','user-route-line');
          ui.layer.append(line);
        }
        segment.forEach((point, index) => {
          const outer = document.createElementNS(ns,'circle');
          outer.setAttribute('cx',String(point.x)); outer.setAttribute('cy',String(point.y)); outer.setAttribute('r',index === 0 ? '5.4' : '4.2');
          outer.setAttribute('fill','#0b0d0a'); outer.setAttribute('stroke',route.color); outer.setAttribute('stroke-width','1.8');
          outer.setAttribute('vector-effect','non-scaling-stroke'); outer.setAttribute('class','user-route-point'); ui.layer.append(outer);
          const dot = document.createElementNS(ns,'circle');
          dot.setAttribute('cx',String(point.x)); dot.setAttribute('cy',String(point.y)); dot.setAttribute('r',index === 0 ? '2.4' : '1.8'); dot.setAttribute('fill',route.color); dot.setAttribute('class','user-route-dot'); ui.layer.append(dot);
        });
        if (segment.length) {
          const first = segment[0];
          const label = document.createElementNS(ns,'text');
          label.setAttribute('x',String(first.x + 13)); label.setAttribute('y',String(first.y - 13)); label.setAttribute('fill',route.color);
          label.setAttribute('class','user-route-label'); label.textContent = route.name; ui.layer.append(label);
        }
      }
    }
  }

  function setPlacing(value) {
    placing = Boolean(value);
    document.body.classList.toggle('route-placement-active', placing);
    refreshUI();
  }

  ui.toggle.addEventListener('click',() => {
    const willOpen = ui.panel.hidden;
    ui.panel.hidden = !willOpen; ui.toggle.setAttribute('aria-expanded',String(willOpen));
    if (willOpen && !routes.length) createRoute('Маршрут 1');
  });
  ui.close?.addEventListener('click',() => { ui.panel.hidden = true; ui.toggle.setAttribute('aria-expanded','false'); setPlacing(false); });
  ui.add?.addEventListener('click',() => createRoute());
  ui.select?.addEventListener('change',() => { activeId = ui.select.value || null; refreshUI(); render(); });
  ui.name?.addEventListener('input',() => {
    const route = activeRoute(); if (!route) return;
    route.name = ui.name.value.slice(0,80) || 'Маршрут';
    const option = ui.select?.querySelector(`option[value="${CSS.escape(route.id)}"]`);
    if (option) option.textContent = route.name;
    render();
  });
  ui.draw?.addEventListener('click',() => { ensureRoute(); setPlacing(!placing); });
  ui.undo?.addEventListener('click',() => { const route = activeRoute(); if (!route?.points.length) return; route.points.pop(); refreshUI(); render(); });
  ui.clear?.addEventListener('click',() => { const route = activeRoute(); if (!route) return; route.points = []; refreshUI(); render(); });
  ui.remove?.addEventListener('click',() => { if (!activeId) return; routes = routes.filter(route => route.id !== activeId); activeId = routes[0]?.id || null; if (!routes.length) setPlacing(false); refreshUI(); render(); });

  ui.save?.addEventListener('click',async() => {
    if (!routes.length) createRoute('Маршрут 1');
    const payload = { format: ROUTE_FORMAT, version: ROUTE_VERSION, createdAt: new Date().toISOString(), routes: routes.map(route => ({ name: route.name, color: route.color, points: route.points.map(point => ({ asset: point.asset, x: point.x, y: point.y })) })) };
    const result = await window.odiumApp?.saveMapRoutes?.(payload);
    if (result && !result.ok && !result.canceled) showError('Не удалось сохранить маршруты');
  });

  function parseImport(content) {
    const data = JSON.parse(content);
    if (!data || data.format !== ROUTE_FORMAT || data.version !== ROUTE_VERSION || !Array.isArray(data.routes)) throw new Error('invalid-format');
    if (data.routes.length > 100) throw new Error('too-many-routes');
    return data.routes.map((route, routeIndex) => {
      if (!route || !Array.isArray(route.points) || route.points.length > 10000) throw new Error('invalid-route');
      const points = route.points.map(point => {
        const asset = String(point?.asset || ''); const x = Number(point?.x), y = Number(point?.y);
        if (!asset.startsWith('assets/') || asset.length > 220 || !Number.isFinite(x) || !Number.isFinite(y) || x < -100 || y < -100 || x > 20000 || y > 20000) throw new Error('invalid-point');
        return { asset, x, y };
      });
      const color = /^#[0-9a-f]{6}$/i.test(String(route.color || '')) ? String(route.color) : palette[(routes.length + routeIndex) % palette.length];
      return { id: uid(), name: String(route.name || `Маршрут ${routes.length + routeIndex + 1}`).trim().slice(0,80) || `Маршрут ${routes.length + routeIndex + 1}`, color, points };
    });
  }

  ui.import?.addEventListener('click',async() => {
    try {
      const result = await window.odiumApp?.importMapRoutes?.();
      if (!result || result.canceled) return;
      if (!result.ok) throw new Error('read-failed');
      const imported = parseImport(result.content);
      if (!imported.length) throw new Error('empty');
      routes.push(...imported); activeId = imported[0].id; refreshUI(); render();
    } catch { showError('Невозможно загрузить маршрут'); }
  });

  // Capture phase prevents the legacy map panning handler from starting while
  // point placement is active, without touching its existing behavior otherwise.
  ui.viewport.addEventListener('pointerdown',event => {
    if (!placing || event.button !== 0 || event.target.closest('button,input,select,dialog,.route-panel')) return;
    event.preventDefault(); event.stopPropagation(); press = { x:event.clientX, y:event.clientY, id:event.pointerId };
  }, true);
  ui.viewport.addEventListener('pointerup',event => {
    if (!placing || !press || press.id !== event.pointerId) return;
    event.preventDefault(); event.stopPropagation();
    const distance = Math.hypot(event.clientX - press.x, event.clientY - press.y); press = null;
    if (distance > 5) return;
    const api = window.__odiumMapRouteApi, view = currentView();
    const pos = api?.clientToMap?.(event.clientX,event.clientY); if (!pos) return;
    if (pos.x < 0 || pos.y < 0 || pos.x > view.width || pos.y > view.height) return;
    ensureRoute().points.push({ asset:view.asset, x:Math.round(pos.x * 1000)/1000, y:Math.round(pos.y * 1000)/1000 });
    refreshUI(); render();
  }, true);
  ui.viewport.addEventListener('pointercancel',() => { press = null; }, true);

  new MutationObserver(render).observe(ui.mapImage,{attributes:true,attributeFilter:['src']});
  window.addEventListener('resize',render);
  refreshUI(); render();
})();
