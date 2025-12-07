// Test file for inventory service
import inventoryService from './inventoryService';

// Test getting all items
console.log('=== Inventory Service Tests ===');

// Test 1: Get all items
const allItems = inventoryService.getAllItems();
console.log(`Test 1 - Total items: ${allItems.length}`);

// Test 2: Get items for a member
const memberItems = inventoryService.getItemsForMember('MEM001');
console.log(`Test 2 - Member MEM001 items: ${memberItems.length}`);

// Test 3: Get stats
const stats = inventoryService.getStats();
console.log(`Test 3 - Stats:`, stats);

// Test 4: Get member stats
const memberStats = inventoryService.getStats('MEM001');
console.log(`Test 4 - Member MEM001 stats:`, memberStats);

// Test 5: Get alerts
const alerts = inventoryService.getAllAlerts();
console.log(`Test 5 - Total alerts: ${alerts.length}`);

// Test 6: Get alerts for member
const memberAlerts = inventoryService.getAlertsForMember('MEM001');
console.log(`Test 6 - Member MEM001 alerts: ${memberAlerts.length}`);

// Test 7: Filter items
const filteredItems = inventoryService.filterBySearch(allItems, 'Organic');
console.log(`Test 7 - Filtered items (Organic): ${filteredItems.length}`);

console.log('=== Tests Complete ===');