import DashboardBuilder from '../components/builders/DashboardBuilder';
import HistoryBuilder from '../components/builders/HistoryBuilder';
import LoginBuilder from '../components/builders/LoginBuilder';
import PaymentBuilder from '../components/builders/PaymentBuilder';
import SeatBuilder from '../components/builders/SeatBuilder';
import DashboardPreview from '../components/previews/DashboardPreview';
import HistoryPreview from '../components/previews/HistoryPreview';
import LoginPreview from '../components/previews/LoginPreview';
import PaymentPreview from '../components/previews/PaymentPreview';
import SeatPreview from '../components/previews/SeatPreview';

export const builderSteps = [
  {
    id: 'loginPage',
    route: 'login',
    short: 'Login',
    label: 'Login Page',
    summary: 'Shape the login screen, headline, fields, and onboarding tone.',
    BuilderComponent: LoginBuilder,
    PreviewComponent: LoginPreview
  },
  {
    id: 'dashboard',
    route: 'dashboard',
    short: 'Dashboard',
    label: 'Search Dashboard',
    summary: 'Refine the booking dashboard and the route search experience.',
    BuilderComponent: DashboardBuilder,
    PreviewComponent: DashboardPreview
  },
  {
    id: 'seatSelection',
    route: 'seats',
    short: 'Seats',
    label: 'Seat Selection',
    summary: 'Control seat or ticket layout, states, and selection styling.',
    BuilderComponent: SeatBuilder,
    PreviewComponent: SeatPreview
  },
  {
    id: 'payment',
    route: 'payment',
    short: 'Payment',
    label: 'Payment Page',
    summary: 'Configure checkout colors, actions, and visible payment methods.',
    BuilderComponent: PaymentBuilder,
    PreviewComponent: PaymentPreview
  },
  {
    id: 'history',
    route: 'history',
    short: 'History',
    label: 'Booking History',
    summary: 'Set the layout and tone for past bookings and customer records.',
    BuilderComponent: HistoryBuilder,
    PreviewComponent: HistoryPreview
  }
];

export const getBuilderStepByRoute = (route) =>
  builderSteps.find((step) => step.route === route) || builderSteps[0];
