// Copyright (c) 2025, Ismarwanto and contributors
// For license information, please see license.txt

// frappe.ui.form.on("LHP Proses", {
// 	refresh(frm) {

// 	},
// });

frappe.ui.form.on("LHP Proses", {
    process_type(frm) {
        if (frm.doc.process_type) {
            frappe.db.get_doc("Process Type", frm.doc.process_type).then(pt => {
                frm.set_value("source_warehouse", pt.default_in_warehouse);
                frm.set_value("target_warehouse", pt.default_out_warehouse);
            });
        }
    },
    output_qty(frm) {
        if (frm.doc.input_qty) {
            frm.set_value("yield_percent", (frm.doc.output_qty / frm.doc.input_qty * 100).toFixed(2));
        }
    }
});

frappe.ui.form.on('LHP Proses Detail', {
    output_item: function(frm, cdt, cdn){
        let row = locals[cdt][cdn];
        if(row.output_item){
            // 1️⃣ Auto fetch default UOM
            frappe.db.get_value('Item', row.output_item, 'stock_uom', (r) => {
                if(r && r.stock_uom) frappe.model.set_value(cdt, cdn, 'uom', r.stock_uom);
            });

            // 2️⃣ Auto fetch group_size & single_size
            frappe.db.get_value('Item', row.output_item, ['group_size', 'single_size'], (r) => {
                if(r && r.group_size){
                    frappe.model.set_value(cdt, cdn, 'group_size', r.group_size);

                    // 3️⃣ Filter single_size sesuai group_size
                    frm.set_query('single_size', function() {
                        return {
                            filters: {
                                'parent_size': r.group_size,
                                'is_group': 0
                            }
                        };
                    });
                }
                if(r && r.single_size) frappe.model.set_value(cdt, cdn, 'single_size', r.single_size);
            });
        }
    }
});