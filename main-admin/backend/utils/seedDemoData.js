require('dotenv').config();

const connectDB = require('../config/db');
const Client = require('../models/Client');
const Design = require('../models/Design');

const demoConfigs = [
  {
    client: {
      clientId: 'tatkal-travel-001',
      name: 'SkyRoute Holidays',
      businessType: 'travel'
    },
    design: {
      status: 'pending',
      config: {
        loginPage: {
          title: 'Welcome to SkyRoute',
          subtitle: 'Book premium trips in minutes',
          theme: {
            primaryColor: '#1d4ed8',
            accentColor: '#22d3ee'
          }
        },
        dashboard: {
          heroLayout: 'split-banner',
          featuredRoutes: true,
          quickSearch: true
        },
        seatSelection: {
          layoutStyle: 'luxury-grid',
          highlightAvailableSeats: '#34d399'
        },
        payment: {
          providers: ['razorpay', 'upi'],
          invoiceBranding: 'SkyRoute'
        },
        history: {
          allowRefundTracking: true,
          showBoardingPass: true
        }
      }
    }
  },
  {
    client: {
      clientId: 'tatkal-event-002',
      name: 'StageCraft Events',
      businessType: 'event'
    },
    design: {
      status: 'approved',
      config: {
        loginPage: {
          title: 'StageCraft Access',
          subtitle: 'Secure tickets for curated live events',
          theme: {
            primaryColor: '#0f766e',
            accentColor: '#f59e0b'
          }
        },
        dashboard: {
          heroLayout: 'centered-spotlight',
          featuredEvents: true,
          countdownBanner: true
        },
        seatSelection: {
          layoutStyle: 'arena-map',
          categoryColors: ['#ef4444', '#f59e0b', '#10b981']
        },
        payment: {
          providers: ['stripe'],
          walletSupport: false
        },
        history: {
          allowRefundTracking: false,
          showQrTicket: true
        }
      }
    }
  },
  {
    client: {
      clientId: 'tatkal-travel-003',
      name: 'MetroSwift Travels',
      businessType: 'travel'
    },
    design: {
      status: 'deployed',
      systemType: 'travel',
      deployedAt: new Date(),
      config: {
        loginPage: {
          title: 'MetroSwift Trips',
          subtitle: 'Fast intercity bookings for daily travelers'
        },
        dashboard: {
          heroLayout: 'compact-search',
          quickSearch: true,
          loyaltyBanner: true
        },
        seatSelection: {
          layoutStyle: 'smart-bus',
          autoSuggestSeats: true
        },
        payment: {
          providers: ['upi', 'netbanking'],
          saveCards: false
        },
        history: {
          recurringBookings: true,
          downloadableInvoices: true
        }
      }
    }
  }
];

const seedDemoData = async () => {
  await connectDB();

  for (const entry of demoConfigs) {
    await Client.findOneAndUpdate({ clientId: entry.client.clientId }, entry.client, {
      upsert: true,
      new: true,
      setDefaultsOnInsert: true
    });

    const existingDesign = await Design.findOne({ clientId: entry.client.clientId });

    if (!existingDesign) {
      await Design.create({
        clientId: entry.client.clientId,
        ...entry.design
      });
    }
  }

  console.log('Demo clients and designs are ready');
  process.exit(0);
};

seedDemoData().catch((error) => {
  console.error('Failed to seed demo data:', error.message);
  process.exit(1);
});
