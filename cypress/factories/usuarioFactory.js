
export function gerarUsuario() {
  const identificador = `${Date.now()}-${Math.random()
    .toString(36)
    .substring(2, 10)}`;

  return {
    name: "QA_Usuario",
    email: `qa.${identificador}@example.com`,
    password: "TesteQA@2026",
    title: "Mr",
    birth_date: "15",
    birth_month: "5",
    birth_year: "1995",
    firstname: "Usuario",
    lastname: "QA",
    company: "Empresa Teste QA",
    address1: "Rua de Teste, 100",
    address2: "Apartamento 10",
    country: "Canada",
    zipcode: "12345",
    state: "Ontario",
    city: "Toronto",
    mobile_number: "1234567890"
  };
}
