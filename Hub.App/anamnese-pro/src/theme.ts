/**
 * 🎨 TEMA DINÂMICO - Sistema de Cores por Profissão
 */

import { useState, useEffect } from 'react';

export type Profissao = 'tatuagem' | 'psicologia' | 'nutricao' | 'fisioterapia' | 'estetica' | 'consultoria';

export interface CoresTema {
  gradient: string;
  gradientHover: string;
  bg50: string;
  bg100: string;
  bg500: string;
  bg600: string;
  text500: string;
  text600: string;
  text700: string;
  border200: string;
  border300: string;
  border500: string;
  hover: string;
  focus: string;
  primary: string;
  secondary: string;
  shadow: string;
}

export const CORES_PROFISSOES: Record<Profissao, CoresTema> = {
  tatuagem: {
    gradient: 'from-pink-500 to-fuchsia-500',
    gradientHover: 'from-pink-600 to-fuchsia-600',
    bg50: 'bg-pink-50',
    bg100: 'bg-pink-100',
    bg500: 'bg-pink-500',
    bg600: 'bg-pink-600',
    text500: 'text-pink-500',
    text600: 'text-pink-600',
    text700: 'text-pink-700',
    border200: 'border-pink-200',
    border300: 'border-pink-300',
    border500: 'border-pink-500',
    hover: 'hover:bg-pink-50 hover:border-pink-500',
    focus: 'focus:border-pink-500',
    primary: '#ec4899',
    secondary: '#d946ef',
    shadow: 'rgba(236, 72, 153, 0.5)',
  },
  psicologia: {
    gradient: 'from-fuchsia-500 to-pink-600',
    gradientHover: 'from-fuchsia-600 to-pink-700',
    bg50: 'bg-fuchsia-50',
    bg100: 'bg-fuchsia-100',
    bg500: 'bg-fuchsia-500',
    bg600: 'bg-fuchsia-600',
    text500: 'text-fuchsia-500',
    text600: 'text-fuchsia-600',
    text700: 'text-fuchsia-700',
    border200: 'border-fuchsia-200',
    border300: 'border-fuchsia-300',
    border500: 'border-fuchsia-500',
    hover: 'hover:bg-fuchsia-50 hover:border-fuchsia-500',
    focus: 'focus:border-fuchsia-500',
    primary: '#d946ef',
    secondary: '#db2777',
    shadow: 'rgba(217, 70, 239, 0.5)',
  },
  nutricao: {
    gradient: 'from-pink-400 to-fuchsia-400',
    gradientHover: 'from-pink-500 to-fuchsia-500',
    bg50: 'bg-pink-50',
    bg100: 'bg-pink-100',
    bg500: 'bg-pink-400',
    bg600: 'bg-pink-500',
    text500: 'text-pink-400',
    text600: 'text-pink-500',
    text700: 'text-pink-600',
    border200: 'border-pink-200',
    border300: 'border-pink-300',
    border500: 'border-pink-400',
    hover: 'hover:bg-pink-50 hover:border-pink-400',
    focus: 'focus:border-pink-400',
    primary: '#f472b6',
    secondary: '#e879f9',
    shadow: 'rgba(244, 114, 182, 0.5)',
  },
  fisioterapia: {
    gradient: 'from-fuchsia-600 to-pink-700',
    gradientHover: 'from-fuchsia-700 to-pink-800',
    bg50: 'bg-fuchsia-50',
    bg100: 'bg-fuchsia-100',
    bg500: 'bg-fuchsia-600',
    bg600: 'bg-fuchsia-700',
    text500: 'text-fuchsia-600',
    text600: 'text-fuchsia-700',
    text700: 'text-fuchsia-800',
    border200: 'border-fuchsia-200',
    border300: 'border-fuchsia-300',
    border500: 'border-fuchsia-600',
    hover: 'hover:bg-fuchsia-50 hover:border-fuchsia-600',
    focus: 'focus:border-fuchsia-600',
    primary: '#c026d3',
    secondary: '#be185d',
    shadow: 'rgba(192, 38, 211, 0.5)',
  },
  estetica: {
    gradient: 'from-pink-500 to-rose-500',
    gradientHover: 'from-pink-600 to-rose-600',
    bg50: 'bg-pink-50',
    bg100: 'bg-pink-100',
    bg500: 'bg-pink-500',
    bg600: 'bg-pink-600',
    text500: 'text-pink-500',
    text600: 'text-pink-600',
    text700: 'text-pink-700',
    border200: 'border-pink-200',
    border300: 'border-pink-300',
    border500: 'border-pink-500',
    hover: 'hover:bg-pink-50 hover:border-pink-500',
    focus: 'focus:border-pink-500',
    primary: '#ec4899',
    secondary: '#f43f5e',
    shadow: 'rgba(236, 72, 153, 0.5)',
  },
  consultoria: {
    gradient: 'from-fuchsia-500 to-purple-600',
    gradientHover: 'from-fuchsia-600 to-purple-700',
    bg50: 'bg-fuchsia-50',
    bg100: 'bg-fuchsia-100',
    bg500: 'bg-fuchsia-500',
    bg600: 'bg-fuchsia-600',
    text500: 'text-fuchsia-500',
    text600: 'text-fuchsia-600',
    text700: 'text-fuchsia-700',
    border200: 'border-fuchsia-200',
    border300: 'border-fuchsia-300',
    border500: 'border-fuchsia-500',
    hover: 'hover:bg-fuchsia-50 hover:border-fuchsia-500',
    focus: 'focus:border-fuchsia-500',
    primary: '#d946ef',
    secondary: '#9333ea',
    shadow: 'rgba(217, 70, 239, 0.5)',
  },
};

export const useCoresProfissao = (): CoresTema => {
  const [cores, setCores] = useState<CoresTema>(() => {
    const config = localStorage.getItem('anamneseConfig');
    const profissao: Profissao = config ? JSON.parse(config).templateProfissao : 'tatuagem';
    return CORES_PROFISSOES[profissao] || CORES_PROFISSOES.tatuagem;
  });

  useEffect(() => {
    const handleStorageChange = () => {
      const config = localStorage.getItem('anamneseConfig');
      const profissao: Profissao = config ? JSON.parse(config).templateProfissao : 'tatuagem';
      setCores(CORES_PROFISSOES[profissao] || CORES_PROFISSOES.tatuagem);
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('anamneseConfigUpdated', handleStorageChange);
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('anamneseConfigUpdated', handleStorageChange);
    };
  }, []);

  return cores;
};

export const getCoresProfissao = (): CoresTema => {
  const config = localStorage.getItem('anamneseConfig');
  const profissao: Profissao = config ? JSON.parse(config).templateProfissao : 'tatuagem';
  return CORES_PROFISSOES[profissao] || CORES_PROFISSOES.tatuagem;
};

export const getProfissaoAtual = (): Profissao => {
  const config = localStorage.getItem('anamneseConfig');
  return config ? JSON.parse(config).templateProfissao : 'tatuagem';
};
