"use client";

import styles from "./header.module.css";
import { RiHealthBookFill } from "react-icons/ri";
import {
  Avatar,
  Dropdown,
  DropdownDivider,
  DropdownHeader,
  DropdownItem,
  Navbar,
  NavbarBrand,
  NavbarCollapse,
  NavbarLink,
  NavbarToggle,
} from "flowbite-react";
import Link from "next/link";

export default function Header() {
  return (
    <>
      <header className={styles.header}>
        <Navbar fluid>
          <NavbarBrand href="http://localhost:3000">
            <RiHealthBookFill color="red" size={32} />

            <span className="self-center whitespace-nowrap text-xl font-semibold dark:text-white">
              Agendamento de Consultas
            </span>
          </NavbarBrand>
          <div className="flex md:order-2">
            <Dropdown arrowIcon={false} inline label={<Avatar rounded />}>
              <DropdownHeader>
                <span className="block text-sm">Usuário</span>
                <span className="block truncate text-sm font-medium">
                  usuario@email.com
                </span>
              </DropdownHeader>
              <DropdownItem>Avisos</DropdownItem>
              <DropdownItem>Configurações</DropdownItem>
              <DropdownItem>Minha conta</DropdownItem>
              <DropdownDivider />
              <DropdownItem>Sair</DropdownItem>
            </Dropdown>
            <NavbarToggle />
          </div>
          <NavbarCollapse>
            <NavbarLink href="/" as={Link} active>
              Home
            </NavbarLink>
            <NavbarLink href="/admin" as={Link}>
              Admin
            </NavbarLink>
            <NavbarLink href="/secretaria" as={Link}>
              Secretaria
            </NavbarLink>
            <NavbarLink href="/paciente" as={Link}>
              Paciente
            </NavbarLink>
            <NavbarLink href="/painel" as={Link}>
              Painel de Consultas
            </NavbarLink>
          </NavbarCollapse>
        </Navbar>
      </header>
    </>
  );
}
