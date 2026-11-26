
export function converterPreco(valor) {
  if (typeof valor !== "string") {
    throw new Error(
      `Formato monetario invalido: ${valor}`
    );
  }

  const valorNormalizado = valor
    .replace("Rs.", "")
    .trim();

  if (!/^\d+(\.\d+)?$/.test(valorNormalizado)) {
    throw new Error(
      `Valor monetario invalido: ${valor}`
    );
  }

  const preco = Number(valorNormalizado);

  if (!Number.isFinite(preco)) {
    throw new Error(
      `Nao foi possivel converter o preco: ${valor}`
    );
  }

  return preco;
}
