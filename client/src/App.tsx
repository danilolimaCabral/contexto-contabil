import { Toaster } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";
import { Route, Switch } from "wouter";
import ErrorBoundary from "./components/ErrorBoundary";
import { ThemeProvider } from "./contexts/ThemeContext";
import Home from "./pages/Home";
import Services from "./pages/Services";
import About from "./pages/About";
import Contact from "./pages/Contact";
import Dashboard from "./pages/Dashboard";
import Reports from "./pages/Reports";
import AdminPanel from "./pages/AdminPanel";
import MemberDashboard from "./pages/MemberDashboard";
import ClientPortal from "./pages/ClientPortal";
import News from "./pages/News";
import Login from "./pages/Login";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Home} />
      <Route path="/servicos" component={Services} />
      <Route path="/sobre" component={About} />
      <Route path="/contato" component={Contact} />
      <Route path="/admin" component={AdminPanel} />
      <Route path="/dashboard" component={Dashboard} />
      <Route path="/meu-painel" component={MemberDashboard} />
      <Route path="/relatorios" component={Reports} />
      <Route path="/portal" component={ClientPortal} />
      <Route path="/noticias" component={News} />
      <Route path="/noticias/:id" component={News} />
      <Route path="/login" component={Login} />
      <Route path="/404" component={NotFound} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <ErrorBoundary>
      <ThemeProvider defaultTheme="dark">
        <TooltipProvider>
          <Toaster />
          <Router />
        </TooltipProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export default App;
