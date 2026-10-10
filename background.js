import OBR from "https://esm.sh/@owlbear-rodeo/sdk@2.2.0";

const ID = "com.foxy-math.owlbear-inverter/tool";

async function invertSelection() {
  const ids = await OBR.player.getSelection();
  if (!ids || ids.length === 0) return;
  const items = await OBR.scene.items.getItems(ids);
  const images = items.filter(item => item.type === "IMAGE");
  if (!images.length) return;
  await OBR.scene.items.updateItems(images, drafts => {
    for (const item of drafts) item.scale.x = -item.scale.x;
  });
}

OBR.onReady(async () => {
  try {
   await OBR.tool.create({
  id: ID,
  shortcut: "f",
  icons: [{ icon: new URL("./icon.svg", import.meta.url).href, label: "Inverter tokens" }],
      onClick() {
        void invertSelection().catch(error => console.error("Inverter Tokens:", error));
        return false;
      }
    });
    console.info("Inverter Tokens: ferramenta registrada.");
  } catch (error) {
    console.error("Inverter Tokens: não foi possível registrar ferramenta:", error);
  }
});
