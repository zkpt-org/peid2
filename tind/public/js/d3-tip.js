d3.tip=function(){function t(t){v=m(t),w=v.createSVGPoint(),$('#container').append(x)/* document.body.appendChild(x) */}function e(){return"n"}function n(){return[0,0]}function r(){return" "}function o(){var t=p();return{top:t.n.y-x.offsetHeight,left:t.n.x-x.offsetWidth/2}}function s(){var t=p();return{top:t.s.y,left:t.s.x-x.offsetWidth/2}}function l(){var t=p();return{top:t.e.y-x.offsetHeight/2,left:t.e.x}}function u(){var t=p();return{top:t.w.y-x.offsetHeight/2,left:t.w.x-x.offsetWidth}}function f(){var t=p();return{top:t.nw.y-x.offsetHeight,left:t.nw.x-x.offsetWidth}}function i(){var t=p();return{top:t.ne.y-x.offsetHeight,left:t.ne.x}}function a(){var t=p();return{top:t.sw.y,left:t.sw.x-x.offsetWidth}}function c(){var t=p();return{top:t.se.y,left:t.e.x}}function d(){var t=d3.select(document.createElement("div"));return t.style({position:"absolute",opacity:0,pointerEvents:"none",boxSizing:"border-box"}),t.node()}function m(t){return t=t.node(),"svg"==t.tagName.toLowerCase()?t:t.ownerSVGElement}function p(){var t=d3.event.target,e={},n=t.getScreenCTM(),r=t.getBBox(),o=r.width,s=r.height,l=r.x,u=r.y,f=document.body.scrollTop,i=document.body.scrollLeft;return document.documentElement&&document.documentElement.scrollTop&&(f=document.documentElement.scrollTop,i=document.documentElement.scrollLeft),w.x=l+i,w.y=u+f,e.nw=w.matrixTransform(n),w.x+=o,e.ne=w.matrixTransform(n),w.y+=s,e.se=w.matrixTransform(n),w.x-=o,e.sw=w.matrixTransform(n),w.y-=s/2,e.w=w.matrixTransform(n),w.x+=o,e.e=w.matrixTransform(n),w.x-=o/2,w.y-=s/2,e.n=w.matrixTransform(n),w.y+=s,e.s=w.matrixTransform(n),e}var y=e,g=n,h=r,x=d(),v=null,w=null;t.show=function(){var e,n=h.apply(this,arguments),r=g.apply(this,arguments),o=y.apply(this,arguments),s=d3.select(x),l=0;for(s.html(n).style({opacity:1,pointerEvents:"all"});l--;)s.classed(E[l],!1);return e=T.get(o).apply(this),s.classed(o,!0).style({top:e.top+r[0]+"px",left:e.left+r[1]+"px"}),t},t.hide=function(){return nodel=d3.select(x),nodel.style({opacity:0,pointerEvents:"none"}),t},t.attr=function(e){if(2>arguments.length&&"string"==typeof e)return d3.select(x).attr(e);var n=Array.prototype.slice.call(arguments);return d3.selection.prototype.attr.apply(d3.select(x),n),t},t.style=function(e){if(2>arguments.length&&"string"==typeof e)return d3.select(x).style(e);var n=Array.prototype.slice.call(arguments);return d3.selection.prototype.style.apply(d3.select(x),n),t},t.direction=function(e){return arguments.length?(y=null==e?e:d3.functor(e),t):y},t.offset=function(e){return arguments.length?(g=null==e?e:d3.functor(e),t):g},t.html=function(e){return arguments.length?(h=null==e?e:d3.functor(e),t):h};var T=d3.map({n:o,s:s,e:l,w:u,nw:f,ne:i,sw:a,se:c}),E=T.keys();return t};