/**
 * Test script for Bright Data MCP integration
 * Run with: node scripts/test-mcp.js
 */

const BASE_URL = 'http://localhost:3001';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testFlightSearch() {
  log('\n✈️  Testing Flight Search API...', 'cyan');
  
  const testCases = [
    {
      name: 'Basic Flight Search',
      params: {
        origin: 'New York',
        destination: 'Paris',
        departureDate: '2024-12-15',
        travelers: 1
      }
    },
    {
      name: 'Round Trip Flight',
      params: {
        origin: 'San Francisco',
        destination: 'Tokyo',
        departureDate: '2024-12-15',
        returnDate: '2024-12-20',
        travelers: 2
      }
    },
    {
      name: 'Short Haul Flight',
      params: {
        origin: 'New York',
        destination: 'Boston',
        departureDate: '2024-12-15',
        travelers: 1
      }
    }
  ];

  for (const testCase of testCases) {
    try {
      log(`\n  Test: ${testCase.name}`, 'yellow');
      
      const response = await fetch(`${BASE_URL}/api/flights/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.params),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      log(`  ✅ Success! Found ${data.count} flights`, 'green');
      
      if (data.flights && data.flights.length > 0) {
        const firstFlight = data.flights[0];
        log(`  First flight: ${firstFlight.airline}`, 'blue');
        log(`  Price: $${firstFlight.price} ${firstFlight.currency}`, 'blue');
        log(`  Duration: ${firstFlight.duration}`, 'blue');
      }
      
    } catch (error) {
      log(`  ❌ Failed: ${error.message}`, 'red');
    }
  }
}

async function testHotelSearch() {
  log('\n🏨 Testing Hotel Search API...', 'cyan');
  
  const testCases = [
    {
      name: 'Basic Hotel Search',
      params: {
        destination: 'Paris',
        checkIn: '2024-12-15',
        checkOut: '2024-12-20',
        guests: 2
      }
    },
    {
      name: 'Hotel in Tokyo',
      params: {
        destination: 'Tokyo',
        checkIn: '2024-12-15',
        checkOut: '2024-12-18',
        guests: 1
      }
    }
  ];

  for (const testCase of testCases) {
    try {
      log(`\n  Test: ${testCase.name}`, 'yellow');
      
      const response = await fetch(`${BASE_URL}/api/hotels/search`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(testCase.params),
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();
      
      log(`  ✅ Success! Found ${data.count} hotels`, 'green');
      
      if (data.hotels && data.hotels.length > 0) {
        const firstHotel = data.hotels[0];
        log(`  First hotel: ${firstHotel.name}`, 'blue');
        log(`  Rating: ${firstHotel.rating} stars`, 'blue');
        log(`  Price: $${firstHotel.pricePerNight}/night`, 'blue');
      }
      
    } catch (error) {
      log(`  ❌ Failed: ${error.message}`, 'red');
    }
  }
}

async function testHealth() {
  log('\n🏥 Testing Health Endpoint...', 'cyan');
  
  try {
    const response = await fetch(`${BASE_URL}/health`);
    const data = await response.json();
    
    log(`  ✅ Backend is healthy!`, 'green');
    log(`  Status: ${data.status}`, 'blue');
    log(`  Timestamp: ${data.timestamp}`, 'blue');
    
    return true;
  } catch (error) {
    log(`  ❌ Backend not responding: ${error.message}`, 'red');
    log(`  Make sure backend is running: cd backend && npm start`, 'yellow');
    return false;
  }
}

async function runAllTests() {
  log('🧪 Starting MCP Integration Tests\n', 'cyan');
  log('='.repeat(50), 'cyan');
  
  // Test health first
  const isHealthy = await testHealth();
  
  if (!isHealthy) {
    log('\n❌ Backend not available. Please start the backend first.', 'red');
    log('   Run: cd backend && npm start', 'yellow');
    process.exit(1);
  }
  
  // Run tests
  await testFlightSearch();
  await testHotelSearch();
  
  log('\n' + '='.repeat(50), 'cyan');
  log('✅ All tests completed!', 'green');
  log('\n💡 To test MCP in AI chat, just ask:', 'yellow');
  log('   "Search for flights from New York to Paris"', 'yellow');
}

// Run tests
runAllTests().catch(error => {
  log(`\n❌ Test runner failed: ${error.message}`, 'red');
  process.exit(1);
});

