import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <p>Conteúdo inválido</p>
      <Link href="/">Voltar</Link>
    </>
  );
}
