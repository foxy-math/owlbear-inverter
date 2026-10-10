import OBR from "https://esm.sh/@owlbear-rodeo/sdk@2.2.0";

const ID = "com.foxy-math.owlbear-inverter";
const FLOATING_ID = `${ID}/botao-flutuante`;

// Mantem a funcao de inverter que ja funcionava.
async function inverter() {
  const ids = await OBR.player.getSelection();
  if (!ids?.length) return;

  const items = await OBR.scene.items.getItems(ids);
  const imagens = items.filter(i => i.type === "IMAGE");
  if (!imagens.length) return;

  await OBR.scene.items.updateItems(imagens, drafts => {
    for (const item of drafts) {
      item.scale.x = -item.scale.x;
    }
  });
}

function executar() {
  inverter().catch(error => console.error("Inverter Tokens:", error));
}

// Botao posicionado abaixo da barra de ferramentas, mas acima do indicador de escala.
async function mostrarBotaoFlutuante() {
  if (!(await OBR.scene.isReady())) return;

  const [largura, altura] = await Promise.all([
    OBR.viewport.getWidth(),
    OBR.viewport.getHeight(),
  ]);

  await OBR.popover.open({
    id: FLOATING_ID,
    url: new URL("./floating.html", import.meta.url).href,
    width: 146,
    height: 86,
    anchorReference: "POSITION",
    anchorPosition: {
      left: Math.max(146, largura - 18),
      top: Math.max(86, Math.min(altura - 110, Math.round(altura * 0.77))),
    },
    anchorOrigin: { horizontal: "RIGHT", vertical: "CENTER" },
    transformOrigin: { horizontal: "RIGHT", vertical: "CENTER" },
    disableClickAway: true,
    hidePaper: true,
  });
}

OBR.onReady(async () => {
  const icon = new URL("./icon.svg", import.meta.url).href;

  // Ferramenta antiga: permanece disponivel.
  await OBR.tool.create({
    id: `${ID}/tool`,
    icons: [{ icon, label: "Inverter Tokens" }],
    onClick() {
      executar();
      return false;
    },
  });

  // Menu antigo: permanece disponivel.
  await OBR.contextMenu.create({
    id: `${ID}/inverter`,
    shortcut: "J",
    icons: [{
      icon,
      label: "Inverter selecionados (J)",
      filter: {
        min: 1,
        every: [{ key: "type", value: "IMAGE" }],
      },
    }],
    onClick() {
      executar();
    },
  });

  // Comando utilizado pela extensao do Chrome no computador.
  window.addEventListener("message", event => {
    try {
      const url = new URL(event.origin);
      if (
        url.hostname !== "owlbear.rodeo" &&
        !url.hostname.endsWith(".owlbear.rodeo")
      ) return;

      if (event.data?.type === "foxy-math:inverter-token") {
        executar();
      }
    } catch (error) {
      console.error("Inverter Tokens:", error);
    }
  });

  // Mostra a janela quando o mapa estiver pronto.
  mostrarBotaoFlutuante().catch(console.error);
  OBR.scene.onReadyChange(ready => {
    if (ready) mostrarBotaoFlutuante().catch(console.error);
  });

  console.log("Inverter Tokens: botao flutuante preparado");
});
