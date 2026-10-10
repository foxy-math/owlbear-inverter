
import OBR from "https://esm.sh/@owlbear-rodeo/sdk@2.2.0";

const ID = "com.foxy-math.owlbear-inverter";

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
  inverter().catch(console.error);
}

OBR.onReady(async () => {
  const icon = new URL("./icon.svg", import.meta.url).href;

  await OBR.tool.create({
    id: `${ID}/tool`,
    icons: [{ icon, label: "Inverter Tokens" }],
    onClick() {
      executar();
      return false;
    }
  });

  await OBR.contextMenu.create({
  id: `${ID}/inverter`,
  shortcut: "J",
  icons: [{
    icon,
    label: "Inverter selecionados (J)",
      filter: {
        min: 1,
        every: [{ key: "type", value: "IMAGE" }]
      }
    }],
    onClick() {
      executar();
    }
  });

  // Recebe o comando do Tampermonkey
  window.addEventListener("message", event => {
    try {
      const url = new URL(event.origin);
      if (
        url.hostname !== "owlbear.rodeo" &&
        !url.hostname.endsWith(".owlbear.rodeo")
      ) return;

      if (
        event.data?.type ===
        "foxy-math:inverter-token"
      ) {
        executar();
      }
    } catch (error) {
      console.error(error);
    }
  });

  console.log("Inverter Tokens pronto!");
});
