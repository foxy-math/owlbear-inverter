
import OBR from "https://esm.sh/@owlbear-rodeo/sdk@2.2.0";

const ID = "com.foxy-math.owlbear-inverter";

// Inverte os tokens selecionados
async function inverter(itemsSelecionados = null) {
  let items = itemsSelecionados;

  if (!items) {
    const ids = await OBR.player.getSelection();

    if (!ids || ids.length === 0) {
      console.log("Nenhum token selecionado");
      return;
    }

    items = await OBR.scene.items.getItems(ids);
  }

  const imagens = items.filter(
    item => item.type === "IMAGE"
  );

  if (imagens.length === 0) return;

  await OBR.scene.items.updateItems(imagens, drafts => {
    for (const item of drafts) {
      item.scale.x = -item.scale.x;
    }
  });
}

// Trata possíveis erros
function executar(items = null) {
  inverter(items).catch(error => {
    console.error("Erro ao inverter token:", error);
  });
}

// Inicialização da extensão
OBR.onReady(async () => {
  const icon = new URL("./icon.svg", import.meta.url).href;

  // Botão original na barra de ferramentas
  await OBR.tool.create({
    id: `${ID}/tool`,
    icons: [
      {
        icon,
        label: "Inverter tokens"
      }
    ],
    onClick() {
      executar();
      return false;
    }
  });

  // Atalho de teclado J
  // Também cria a opção no menu de contexto
  await OBR.contextMenu.create({
    id: `${ID}/inverter-j`,
    shortcut: "J",
    icons: [
      {
        icon,
        label: "Inverter selecionados (J)",
        filter: {
          min: 1,
          every: [
            {
              key: "type",
              value: "IMAGE"
            }
          ]
        }
      }
    ],
    onClick(context) {
      executar(context.items);
    }
  });

  console.log("Inverter Tokens: atalho J registrado!");
});
