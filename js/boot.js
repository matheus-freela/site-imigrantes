/* marca JS antes da primeira pintura, para as animações de entrada não piscarem */
if(!window.matchMedia("(prefers-reduced-motion: reduce)").matches){
  document.documentElement.classList.add("js");
  // rede de segurança: se o script principal não rodar, mostra tudo sem animação em vez de deixar a página vazia
  setTimeout(function(){ var d = document.documentElement; if(!d.classList.contains("booted")){ d.classList.remove("js"); } }, 3500);
}

/* fila do Vercel Analytics: eventos chamados antes do script carregar não se perdem */
window.va = window.va || function(){ (window.vaq = window.vaq || []).push(arguments); };
