# medical-brew
## 💉 Dose Calculator App

Aplicativo mobile criado com **React Native + Expo** para auxiliar médicos e enfermeiros no cálculo rápido e seguro de doses de anestésicos, com base em peso, altura e sexo do paciente.  
✅ **Sem necessidade de login.**

---

## 📱 Funcionalidades

- **Seleção de anestésicos populares**
  - Propofol
  - Midazolam
  - Fentanil
  - Etomidato
  - Cetamina

- **Cálculo automático da dose**
  - Baseado no peso (kg), altura (cm) e sexo do paciente.
  - Fórmulas aplicadas automaticamente.

- **Cadastro de novos anestésicos**
  - Insira nome, unidade e fórmula personalizada.
  - Os dados são salvos localmente usando AsyncStorage.

- **Interface intuitiva e responsiva**
  - Foco na usabilidade rápida em ambientes clínicos.
  - Design leve e acessível.

---

## 🧪 Fórmulas pré-cadastradas

| Anestésico  | Fórmula utilizada          | Unidade |
|-------------|---------------------------|---------|
| Propofol    | `dose = 2.5 * peso`       | mg      |
| Midazolam   | `dose = 0.1 * peso`       | mg      |
| Fentanil    | `dose = 1.5 * peso`       | mcg     |
| Etomidato   | `dose = 0.3 * peso`       | mg      |
| Cetamina    | `dose = 1 * peso`         | mg      |

---

## 🚀 Tecnologias

- [React Native](https://reactnative.dev/)
- [Expo](https://expo.dev/)
- [React Navigation](https://reactnavigation.org/)
- [AsyncStorage](https://react-native-async-storage.github.io/async-storage/)

---

## 🧭 Como rodar o projeto

```bash
# 1. Clone o repositório
git clone https://github.com/seu-usuario/dose-calculator-app.git
cd dose-calculator-app

# 2. Instale as dependências
npm install

# 3. Rode o projeto com Expo
npx expo start
```

Você pode escanear o QR code com o app Expo Go no celular 📱

---

## 📂 Estrutura de pastas

```
.
├── App.js
├── assets/
├── components/
│   ├── DrugForm.js
│   └── ResultCard.js
├── screens/
│   ├── HomeScreen.js
│   ├── AddDrugScreen.js
│   └── CalculatorScreen.js
├── storage/
│   └── drugStorage.js
```

---

## 🛡️ Licença

MIT © 2025 - Desenvolvido com 💙 by srk dev, para uso médico-hospitalar.