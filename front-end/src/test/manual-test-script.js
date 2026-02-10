/**
 * Manual Testing Script
 * Run this in browser console to test all endpoints and functionality
 */

// Test Registration Service
async function testRegistrationService() {
  console.log('🧪 Testing Registration Service...');
  
  try {
    // 1. Get total count
    console.log('\n1. Getting total attendee count...');
    const count = await registrationService.getTotalAttendeeCount();
    console.log('✅ Count result:', count);
    
    // 2. Submit attendee
    console.log('\n2. Submitting attendee...');
    const submitResult = await registrationService.submitAttendee({
      name: 'Test User',
      email: `test${Date.now()}@example.com`,
      phone: '1234567890',
      age: 25,
      occupation: 'Student',
      motivation: 'Testing the system',
      newsletter: false,
    });
    console.log('✅ Submit result:', submitResult);
    
    // 3. Find attendee
    if (submitResult.success && submitResult.data) {
      console.log('\n3. Finding attendee by email...');
      const found = await registrationService.findAttendeeByEmail(submitResult.data.email);
      console.log('✅ Found attendee:', found);
      
      // 4. Update status
      if (found.success && found.data) {
        console.log('\n4. Updating attendee status to approved...');
        const updateResult = await registrationService.updateAttendeeStatus(
          found.data.id,
          'approved'
        );
        console.log('✅ Update result:', updateResult);
      }
    }
    
    console.log('\n✅ Registration Service Tests Complete!');
  } catch (error) {
    console.error('❌ Registration Service Test Failed:', error);
  }
}

// Test Settings Service
async function testSettingsService() {
  console.log('\n🧪 Testing Settings Service...');
  
  try {
    // 1. Get registration status
    console.log('\n1. Checking registration status...');
    const isOpen = await settingsService.isRegistrationOpen();
    console.log('✅ Registration open:', isOpen);
    
    // 2. Toggle registration
    console.log('\n2. Toggling registration...');
    const toggleResult = await settingsService.setRegistrationOpen(!isOpen);
    console.log('✅ Toggle result:', toggleResult);
    
    // 3. Verify change
    const newStatus = await settingsService.isRegistrationOpen();
    console.log('✅ New status:', newStatus);
    console.log('✅ Status changed:', newStatus !== isOpen);
    
    // 4. Restore original
    await settingsService.setRegistrationOpen(isOpen);
    console.log('✅ Restored original status');
    
    // 5. Test show speakers
    console.log('\n3. Testing show speakers...');
    const showSpeakers = await settingsService.isShowSpeakers();
    console.log('✅ Show speakers:', showSpeakers);
    
    const toggleSpeakers = await settingsService.setShowSpeakers(!showSpeakers);
    console.log('✅ Toggle speakers result:', toggleSpeakers);
    
    // Restore
    await settingsService.setShowSpeakers(showSpeakers);
    console.log('✅ Restored original speakers setting');
    
    console.log('\n✅ Settings Service Tests Complete!');
  } catch (error) {
    console.error('❌ Settings Service Test Failed:', error);
  }
}

// Test Auth Service
async function testAuthService() {
  console.log('\n🧪 Testing Auth Service...');
  
  try {
    // Note: This requires real Supabase credentials
    console.log('\n⚠️  Auth tests require real Supabase setup');
    console.log('To test:');
    console.log('1. Ensure admin user exists in Supabase');
    console.log('2. Call: await authService.adminLogin("admin@example.com", "password")');
    console.log('3. Verify role === "admin"');
    
    console.log('\n✅ Auth Service Test Instructions Complete!');
  } catch (error) {
    console.error('❌ Auth Service Test Failed:', error);
  }
}

// Test Capacity Limit
async function testCapacityLimit() {
  console.log('\n🧪 Testing Capacity Limit...');
  
  try {
    const count = await registrationService.getTotalAttendeeCount();
    console.log('📊 Current count:', count.count);
    console.log('📊 Capacity limit: 250');
    console.log('📊 Available:', 250 - (count.count || 0));
    
    if (count.count >= 250) {
      console.log('⚠️  Capacity reached! Registration should be blocked.');
    } else {
      console.log('✅ Capacity available. Registration should work.');
    }
    
    console.log('\n✅ Capacity Limit Test Complete!');
  } catch (error) {
    console.error('❌ Capacity Limit Test Failed:', error);
  }
}

// Run All Tests
async function runAllTests() {
  console.log('🚀 Starting Comprehensive Test Suite...\n');
  console.log('='.repeat(50));
  
  await testCapacityLimit();
  await testRegistrationService();
  await testSettingsService();
  await testAuthService();
  
  console.log('\n' + '='.repeat(50));
  console.log('✅ All Tests Complete!');
  console.log('\n📝 Check the results above for any errors.');
}

// Export for use in browser console
if (typeof window !== 'undefined') {
  window.testRegistrationService = testRegistrationService;
  window.testSettingsService = testSettingsService;
  window.testAuthService = testAuthService;
  window.testCapacityLimit = testCapacityLimit;
  window.runAllTests = runAllTests;
  
  console.log('✅ Test functions loaded!');
  console.log('Run: runAllTests() to test everything');
  console.log('Or run individual tests:');
  console.log('  - testRegistrationService()');
  console.log('  - testSettingsService()');
  console.log('  - testAuthService()');
  console.log('  - testCapacityLimit()');
}

export {
  testRegistrationService,
  testSettingsService,
  testAuthService,
  testCapacityLimit,
  runAllTests,
};
