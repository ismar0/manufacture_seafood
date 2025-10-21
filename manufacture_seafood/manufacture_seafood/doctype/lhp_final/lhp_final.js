// Copyright (c) 2025, Ismarwanto and contributors
// For license information, please see license.txt

// frappe.ui.form.on("LHP Final", {
// 	refresh(frm) {

// 	},
// });

frappe.ui.form.on('LHP Final Detail', {
    output_qty: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if(row.output_item) {
            // 1️⃣ Ambil conversion_factor dari Item Master
            frappe.db.get_value('Item', row.output_item, 'conversion_factor', (r) => {
                if(r.conversion_factor) {
                    frappe.model.set_value(cdt, cdn, 'conversion_factor', r.conversion_factor);
                    
                    // 2️⃣ Hitung output_weight_kg
                    let output_weight = row.output_qty * r.conversion_factor;
                    frappe.model.set_value(cdt, cdn, 'output_weight_kg', output_weight);

                    // 3️⃣ Hitung DM, DL, FOH, total_cost preview
                    let dm_per_kg = row.dm_cost || 0;
                    let dl_per_kg = row.dl_cost || 0;
                    let foh_per_kg = row.foh_cost || 0;

                    frappe.model.set_value(cdt, cdn, 'dm_cost', output_weight * dm_per_kg);
                    frappe.model.set_value(cdt, cdn, 'dl_cost', output_weight * dl_per_kg);
                    frappe.model.set_value(cdt, cdn, 'foh_cost', output_weight * foh_per_kg);

                    let total_cost = output_weight * (dm_per_kg + dl_per_kg + foh_per_kg);
                    frappe.model.set_value(cdt, cdn, 'total_cost', total_cost);
                }
            });
        }
    },
    output_item: function(frm, cdt, cdn) {
        let row = locals[cdt][cdn];
        if(row.output_item) {
            // set default UOM ke MC
            frappe.db.get_value('Item', row.output_item, 'stock_uom', (r) => {
                if(r.stock_uom) {
                    frappe.model.set_value(cdt, cdn, 'uom', 'MC');
                }
            });
        }
    }
});
