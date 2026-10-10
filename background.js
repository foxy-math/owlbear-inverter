
import OBR from "https://esm.sh/@owlbear-rodeo/sdk@2.2.0";

const ID = "com.foxy-math.owlbear-inverter";

async function inverter() {
  const ids = await OBR.player.getSelection();

  if (!ids || ids.length === 0) return;

  const items = await OBR.scene.items.getItems(ids);
  const imagens = items.filter(item => item.type === "IMAGE");

  if (!imagens.length) return;

  await OBR.scene.items.updateItems(imagens, drafts => {
    for (const item of drafts) {
      item.scale.x = -item.scale.x;
    }
  });
}

function executar() {
  inverter().catch(error => {
    console.error("Erro ao inverter:", error);
  });
}

OBR.onReady(async () => {
  const icon = new URL("./icon.svg", import.meta.url).href;

  // Ferramenta com atalho J
  await OBR.tool.create({
    id: `${ID}/tool`,
    shortcut: "J",
    icons: [{
      icon,
      label: "Inverter Tokens (J)"
    }],
    onClick() {
      executar();
      return false;
    }
  });

  // Mantém a opção no menu de contexto
  await OBR.contextMenu.create({
    id: `${ID}/inverter-j`,
    icons: [{
      icon,
      label: "Inverter selecionados",
      filter: {
        min: 1,
        every: [{
          key: "type",
          value: "IMAGE"
        }]
      }
    }],
    onClick() {
      executar();
    }
  });

  console.log("Inverter Tokens: ferramenta J registrada");
});
