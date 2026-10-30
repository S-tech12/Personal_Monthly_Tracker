$targetDir = "E:\final projects\TalkTrack\voicespend"
$srcDir = "$targetDir\src"

$folders = @(
    "pages",
    "components\common",
    "components\layout",
    "components\dashboard",
    "components\budget",
    "components\notifications",
    "hooks",
    "services",
    "types",
    "context",
    "constants",
    "styles",
    "utils",
    "assets"
)

foreach ($folder in $folders) {
    New-Item -Path "$srcDir\$folder" -ItemType Directory -Force | Out-Null
}

$files = @{
    "pages\LoginPage.tsx" = "export const LoginPage = () => { return <div>TODO: LoginPage</div> };"
    "pages\DashboardPage.tsx" = "export const DashboardPage = () => { return <div>TODO: DashboardPage</div> };"
    "pages\BudgetPage.tsx" = "export const BudgetPage = () => { return <div>TODO: BudgetPage</div> };"
    "pages\NotificationsPage.tsx" = "export const NotificationsPage = () => { return <div>TODO: NotificationsPage</div> };"
    "pages\SettingsPage.tsx" = "export const SettingsPage = () => { return <div>TODO: SettingsPage</div> };"
    "pages\SignupPage.tsx" = "export const SignupPage = () => { return <div>TODO: SignupPage</div> };"
    "pages\index.ts" = "export * from './LoginPage';`nexport * from './DashboardPage';`nexport * from './BudgetPage';`nexport * from './NotificationsPage';`nexport * from './SettingsPage';`nexport * from './SignupPage';"

    "components\common\Button.tsx" = "export const Button = () => { return <div>TODO: Button</div> };"
    "components\common\Input.tsx" = "export const Input = () => { return <div>TODO: Input</div> };"
    "components\common\Card.tsx" = "export const Card = () => { return <div>TODO: Card</div> };"
    "components\common\Modal.tsx" = "export const Modal = () => { return <div>TODO: Modal</div> };"
    "components\common\Toast.tsx" = "export const Toast = () => { return <div>TODO: Toast</div> };"
    "components\common\ProgressBar.tsx" = "export const ProgressBar = () => { return <div>TODO: ProgressBar</div> };"
    "components\common\Skeleton.tsx" = "export const Skeleton = () => { return <div>TODO: Skeleton</div> };"
    "components\common\index.ts" = "export * from './Button';`nexport * from './Input';`nexport * from './Card';`nexport * from './Modal';`nexport * from './Toast';`nexport * from './ProgressBar';`nexport * from './Skeleton';"

    "components\layout\Navbar.tsx" = "export const Navbar = () => { return <div>TODO: Navbar</div> };"
    "components\layout\Sidebar.tsx" = "export const Sidebar = () => { return <div>TODO: Sidebar</div> };"
    "components\layout\ProtectedRoute.tsx" = "export const ProtectedRoute = () => { return <div>TODO: ProtectedRoute</div> };"
    "components\layout\PageLayout.tsx" = "export const PageLayout = () => { return <div>TODO: PageLayout</div> };"
    "components\layout\index.ts" = "export * from './Navbar';`nexport * from './Sidebar';`nexport * from './ProtectedRoute';`nexport * from './PageLayout';"

    "components\dashboard\SpeakButton.tsx" = "export const SpeakButton = () => { return <div>TODO: SpeakButton</div> };"
    "components\dashboard\SummaryCard.tsx" = "export const SummaryCard = () => { return <div>TODO: SummaryCard</div> };"
    "components\dashboard\ExpenseTable.tsx" = "export const ExpenseTable = () => { return <div>TODO: ExpenseTable</div> };"
    "components\dashboard\TrendChart.tsx" = "export const TrendChart = () => { return <div>TODO: TrendChart</div> };"
    "components\dashboard\CategoryChart.tsx" = "export const CategoryChart = () => { return <div>TODO: CategoryChart</div> };"
    "components\dashboard\index.ts" = "export * from './SpeakButton';`nexport * from './SummaryCard';`nexport * from './ExpenseTable';`nexport * from './TrendChart';`nexport * from './CategoryChart';"

    "components\budget\BudgetCategoryCard.tsx" = "export const BudgetCategoryCard = () => { return <div>TODO: BudgetCategoryCard</div> };"
    "components\budget\AddBudgetModal.tsx" = "export const AddBudgetModal = () => { return <div>TODO: AddBudgetModal</div> };"
    "components\budget\BudgetProgressBar.tsx" = "export const BudgetProgressBar = () => { return <div>TODO: BudgetProgressBar</div> };"
    "components\budget\index.ts" = "export * from './BudgetCategoryCard';`nexport * from './AddBudgetModal';`nexport * from './BudgetProgressBar';"

    "components\notifications\NotificationItem.tsx" = "export const NotificationItem = () => { return <div>TODO: NotificationItem</div> };"
    "components\notifications\NotificationDropdown.tsx" = "export const NotificationDropdown = () => { return <div>TODO: NotificationDropdown</div> };"
    "components\notifications\index.ts" = "export * from './NotificationItem';`nexport * from './NotificationDropdown';"

    "components\index.ts" = "export * from './common';`nexport * from './layout';`nexport * from './dashboard';`nexport * from './budget';`nexport * from './notifications';"

    "hooks\useVoiceInput.ts" = "export const useVoiceInput = () => { // TODO: useVoiceInput };"
    "hooks\useAuth.ts" = "export const useAuth = () => { // TODO: useAuth };"
    "hooks\useExpenseList.ts" = "export const useExpenseList = () => { // TODO: useExpenseList };"
    "hooks\useExpenseSummary.ts" = "export const useExpenseSummary = () => { // TODO: useExpenseSummary };"
    "hooks\useBudget.ts" = "export const useBudget = () => { // TODO: useBudget };"
    "hooks\useNotifications.ts" = "export const useNotifications = () => { // TODO: useNotifications };"
    "hooks\index.ts" = "export * from './useVoiceInput';`nexport * from './useAuth';`nexport * from './useExpenseList';`nexport * from './useExpenseSummary';`nexport * from './useBudget';`nexport * from './useNotifications';"

    "services\apiClient.ts" = "export const apiClient = {}; // TODO: apiClient"
    "services\authService.ts" = "export const authService = {}; // TODO: authService"
    "services\expenseService.ts" = "export const expenseService = {}; // TODO: expenseService"
    "services\budgetService.ts" = "export const budgetService = {}; // TODO: budgetService"
    "services\notificationService.ts" = "export const notificationService = {}; // TODO: notificationService"
    "services\reportService.ts" = "export const reportService = {}; // TODO: reportService"
    "services\settingsService.ts" = "export const settingsService = {}; // TODO: settingsService"
    "services\index.ts" = "export * from './apiClient';`nexport * from './authService';`nexport * from './expenseService';`nexport * from './budgetService';`nexport * from './notificationService';`nexport * from './reportService';`nexport * from './settingsService';"

    "types\auth.types.ts" = "export interface Auth { /* TODO */ }"
    "types\expense.types.ts" = "export interface Expense { /* TODO */ }"
    "types\budget.types.ts" = "export interface Budget { /* TODO */ }"
    "types\notification.types.ts" = "export interface Notification { /* TODO */ }"
    "types\settings.types.ts" = "export interface Settings { /* TODO */ }"
    "types\index.ts" = "export * from './auth.types';`nexport * from './expense.types';`nexport * from './budget.types';`nexport * from './notification.types';`nexport * from './settings.types';"

    "context\AuthContext.tsx" = "export const AuthContext = {}; // TODO: AuthContext"
    "context\NotificationContext.tsx" = "export const NotificationContext = {}; // TODO: NotificationContext"
    "context\index.ts" = "export * from './AuthContext';`nexport * from './NotificationContext';"

    "constants\routes.ts" = "export const ROUTES = {}; // TODO: ROUTES"
    "constants\currencies.ts" = "export const CURRENCIES = {}; // TODO: CURRENCIES"
    "constants\config.ts" = "export const CONFIG = {}; // TODO: CONFIG"
    "constants\index.ts" = "export * from './routes';`nexport * from './currencies';`nexport * from './config';"

    "styles\global.css" = "/* TODO: global.css */"
    "styles\variables.css" = "/* TODO: variables.css */"

    "utils\formatCurrency.ts" = "export const formatCurrency = () => { // TODO: formatCurrency };"
    "utils\formatDate.ts" = "export const formatDate = () => { // TODO: formatDate };"
    "utils\validators.ts" = "export const validators = {}; // TODO: validators"
    "utils\index.ts" = "export * from './formatCurrency';`nexport * from './formatDate';`nexport * from './validators';"

    "App.tsx" = "import { BrowserRouter } from 'react-router-dom';`n`nfunction App() {`n  return (`n    <BrowserRouter>`n      {/* TODO: Router Setup */}`n      <div>App</div>`n    </BrowserRouter>`n  );`n}`n`nexport default App;"
    "main.tsx" = "import { StrictMode } from 'react'`nimport { createRoot } from 'react-dom/client'`nimport App from './App.tsx'`nimport './styles/global.css'`n`ncreateRoot(document.getElementById('root')!).render(`n  <StrictMode>`n    <App />`n  </StrictMode>,`n)"
}

foreach ($key in $files.Keys) {
    Set-Content -Path "$srcDir\$key" -Value $files[$key]
}

Set-Content -Path "$targetDir\.env.example" -Value "VITE_API_BASE_URL=http://localhost:3000/api"

$readmeContent = @"
# VoiceSpend

VoiceSpend is a React + TypeScript + Vite project with a scalable, production-grade folder structure.

## Folder Structure

- \`src/pages/\` - One file per screen (JSX only, no logic)
- \`src/components/\` - Reusable UI components, organized by domain
- \`src/hooks/\` - Custom React hooks
- \`src/services/\` - API call layer
- \`src/types/\` - TypeScript interfaces/types
- \`src/context/\` - React context providers
- \`src/constants/\` - Application constants
- \`src/styles/\` - Global styles and CSS variables
- \`src/utils/\` - Helper functions
- \`src/assets/\` - Static assets

"@

Set-Content -Path "$targetDir\README.md" -Value $readmeContent
