/**
 * Test Helpers for Manual Testing
 */

import { registrationService } from '@/services/registrationService';
import { settingsService } from '@/services/settingsService';

export const testHelpers = {
  /**
   * Test complete registration flow
   */
  async testRegistrationFlow() {
    console.group('🧪 Registration Flow Test');
    
    try {
      // 1. Check capacity
      const count = await registrationService.getTotalAttendeeCount();
      console.log('📊 Current count:', count.count);
      
      if (count.count >= 250) {
        console.warn('⚠️ Capacity reached!');
        return;
      }
      
      // 2. Submit registration
      const email = `test${Date.now()}@example.com`;
      const submitResult = await registrationService.submitAttendee({
        name: 'Test User',
        email,
        phone: '1234567890',
        age: 25,
        occupation: 'Student',
        motivation: 'Testing',
      });
      
      console.log('✅ Submit result:', submitResult);
      
      if (submitResult.success) {
        // 3. Find attendee
        const found = await registrationService.findAttendeeByEmail(email);
        console.log('✅ Found attendee:', found);
        
        return { success: true, attendee: found.data };
      }
      
      return { success: false, error: submitResult.error };
    } catch (error) {
      console.error('❌ Test failed:', error);
      return { success: false, error };
    } finally {
      console.groupEnd();
    }
  },

  /**
   * Test capacity limit
   */
  async testCapacityLimit() {
    console.group('🧪 Capacity Limit Test');
    
    try {
      const count = await registrationService.getTotalAttendeeCount();
      const available = 250 - (count.count || 0);
      
      console.log('📊 Current:', count.count);
      console.log('📊 Capacity: 250');
      console.log('📊 Available:', available);
      console.log('📊 Status:', available > 0 ? '✅ Available' : '❌ Full');
      
      return { count: count.count, available, isFull: available <= 0 };
    } catch (error) {
      console.error('❌ Test failed:', error);
      return { error };
    } finally {
      console.groupEnd();
    }
  },

  /**
   * Test settings toggles
   */
  async testSettings() {
    console.group('🧪 Settings Test');
    
    try {
      // Get current values
      const [isOpen, showSpeakers] = await Promise.all([
        settingsService.isRegistrationOpen(),
        settingsService.isShowSpeakers(),
      ]);
      
      console.log('📊 Current settings:');
      console.log('  - Registrations open:', isOpen);
      console.log('  - Show speakers:', showSpeakers);
      
      // Toggle and restore
      await settingsService.setRegistrationOpen(!isOpen);
      await settingsService.setShowSpeakers(!showSpeakers);
      
      const [newIsOpen, newShowSpeakers] = await Promise.all([
        settingsService.isRegistrationOpen(),
        settingsService.isShowSpeakers(),
      ]);
      
      console.log('✅ Toggled successfully');
      console.log('  - New registrations open:', newIsOpen);
      console.log('  - New show speakers:', newShowSpeakers);
      
      // Restore
      await settingsService.setRegistrationOpen(isOpen);
      await settingsService.setShowSpeakers(showSpeakers);
      console.log('✅ Restored original settings');
      
      return { success: true };
    } catch (error) {
      console.error('❌ Test failed:', error);
      return { success: false, error };
    } finally {
      console.groupEnd();
    }
  },

  /**
   * Test attendee status update
   */
  async testStatusUpdate(email: string) {
    console.group('🧪 Status Update Test');
    
    try {
      // Find attendee
      const found = await registrationService.findAttendeeByEmail(email);
      
      if (!found.success || !found.data) {
        console.error('❌ Attendee not found');
        return { success: false };
      }
      
      console.log('📊 Current status:', found.data.status);
      
      // Update to approved
      const updateResult = await registrationService.updateAttendeeStatus(
        found.data.id,
        'approved'
      );
      
      console.log('✅ Update result:', updateResult);
      
      // Verify
      const verify = await registrationService.findAttendeeByEmail(email);
      console.log('✅ Verified status:', verify.data?.status);
      
      return { success: true, newStatus: verify.data?.status };
    } catch (error) {
      console.error('❌ Test failed:', error);
      return { success: false, error };
    } finally {
      console.groupEnd();
    }
  },
};

// Make available in browser console
if (typeof window !== 'undefined') {
  (window as any).testHelpers = testHelpers;
  console.log('✅ Test helpers loaded!');
  console.log('Available functions:');
  console.log('  - testHelpers.testRegistrationFlow()');
  console.log('  - testHelpers.testCapacityLimit()');
  console.log('  - testHelpers.testSettings()');
  console.log('  - testHelpers.testStatusUpdate("email@example.com")');
}
