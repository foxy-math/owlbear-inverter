import OBR from "https://esm.sh/@owlbear-rodeo/sdk@2.2.0";

const button = document.querySelector("#invert");
const status = document.querySelector("#status");

OBR.onReady(() => {
  button.disabled = false;
  button.textContent = "↔ Inverter selecionados";
  status.textContent = "Selecione tokens no mapa e clique acima.";
});

button.addEventListener("click", async () => {
  button.disabled = true;
  try {
    const ids = await OBR.player.getSelection();
    if (!ids || ids.length === 0) {
      status.textContent = "Selecione ao menos um token.";
      return;
    }
    const items = await OBR.scene.items.getItems(ids);
    const images = items.filter(item => item.type === "IMAGE");
    if (!images.length) {
      status.textContent = "Selecione tokens que sejam imagens.";
      return;
    }
    await OBR.scene.items.updateItems(images, drafts => {
      for (const item of drafts) item.scale.x = -item.scale.x;
    });
    status.textContent = `${images.length} token(s) invertido(s).`;
  } catch (error) {
    console.error("Inverter Tokens:", error);
    status.textContent = "Erro ao inverter. Veja o console.";
  } finally {
    button.disabled = false;
  }
});
