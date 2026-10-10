
import OBR from "https://esm.sh/@owlbear-rodeo/sdk@2.2.0";

const ID = "com.foxy-math.owlbear-inverter/tool";
const ACTION_ID = "com.foxy-math.owlbear-inverter/shortcut";

async function inverter() {
  const ids = await OBR.player.getSelection();
  if (!ids || ids.length === 0) return;

  const items = await OBR.scene.items.getItems(ids);
  const imagens = items.filter(item => item.type === "IMAGE");

  if (imagens.length === 0) return;

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

  // Mantém o botão que já funciona
  await OBR.tool.create({
    id: ID,
    icons: [{
      icon,
      label: "Inverter tokens"
    }],
    onClick() {
      executar();
      return false;
    }
  });

  // Nova ação com atalho F
  await OBR.tool.createAction({
    id: ACTION_ID,
    shortcut: "F",
    icons: [{
      icon,
      label: "Inverter selecionados (F)"
    }],
    onClick() {
      executar();
    }
  });

  console.log("Inverter Tokens: atalho registrado");
});
