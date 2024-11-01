(function( $ ) {
	'use strict';
	
	var loader = '<img src="img/loading.gif"/> ';

	$(function() {
		
		/*Para addon exportación*/
		
		var opt1 = '<option value="1">Bienes</option><option value="2">Servicios</option><option value="3">Productos y servicios</option>';
		var opt2 = '<option value="1">Exportación definitiva de bienes</option><option value="2">Servicios</option><option value="4">Otros</option>';
		
		if($("#wc_settings_tab_woo_facturante_tipo_comprobante").length>0 && $("#wc_settings_tab_woo_facturante_bienes").length>0){
				
			$("#wc_settings_tab_woo_facturante_tipo_comprobante").change(function(){
				console.log(this.value);
				if(this.value=='FE'){
					$("#wc_settings_tab_woo_facturante_bienes").html(opt2);
				}else{
					$("#wc_settings_tab_woo_facturante_bienes").html(opt1);	
				}
				
			});
			
		}
		
		
		if($("#wf-tipo-comprobante-metabox").length>0 && $("#wf-bienes-metabox").length>0){
			
			$("#wf-tipo-comprobante-metabox").change(function(){
				
				if(this.value=='FE'){
					$("#wf-bienes-metabox").html(opt2);
					$('#wf-encabezadoE').css('display','block');
					$("#wf-tipo-documento-metabox").val(16);
					if($("#wf-bienes-metabox").val()==1){
						$(".fy-incoterm").css('display','block');
					}else{
						$(".fy-incoterm").css('display','none');
					}
				}else{
					$("#wf-bienes-metabox").html(opt1);
					$('#wf-encabezadoE').css('display','none');
				}
				
			});
			
		}
		
		if($("#wf-bienes-metabox").length>0){
			
			$("#wf-bienes-metabox").change(function(){
				
				if(this.value==1){
					$(".fy-incoterm").css('display','block');
				}else{
					$(".fy-incoterm").css('display','none');
				}
			});
			
		}
		
		
		$('.fy-invoice-button').click(function(e){
			
			$(this).css('pointer-events', 'none').css('cursor', 'default');
			
			e.preventDefault();
			
			if(jQuery("#post_ID").length>0){
			
				var order_id = jQuery("#post_ID").val();
			
			}else{
			
				var order_aux = jQuery(this).closest('tr').attr('id').split('-');
					
				var order_id = order_aux[1];
			
			}
			
			var td = $(this).closest('p');
			
			var esto = $(this);
			
			var data = {
				
				action: 'woo_facturante_do_ajax_request',
				
				order: order_id
			
			}
			
			/*Para addon condicion venta*/
			if($("#wf-selling-condition-metabox").length>0){
				
				data.pm = $("#wf-selling-condition-metabox").val();
			
			}
			
			/*Para addon exportación*/			
			if($("#wf-tipo-comprobante-metabox").length>0){
				
				/* Datos cliente */
				data.tipoDocumento = $("#wf-tipo-documento-metabox").val();
				data.tratamientoImpositivo = $("#wf-tratamiento-impositivo-metabox").val();
				
				/* Datos encabezado */
				data.bienes = $("#wf-bienes-metabox").val();
				data.tipoComprobante = $("#wf-tipo-comprobante-metabox").val();
				data.moneda = $("#wf-moneda-metabox").val();
				
				/* Datos encabezado.encabezadoE */
				data.codPais = $("#wf-codpais-metabox").val();
				data.cuitPais = $("#wf-cuitpais-metabox").val();
				data.incoterm = $("#wf-incoterm-metabox").val();
				
				
			}
			
		
			jQuery.post( ajaxurl, data, function( data ) {
				
				var obj = JSON.parse(data);
				
				if($("#wf-tipo-comprobante-metabox").length>0){
					
					if(obj.CrearComprobanteFullResult.Estado=="OK"){
					
					
					var viewButton = '<a class="button tips fy-view-invoice-button" data-invoice="'+obj.CrearComprobanteFullResult.IdComprobante+'" href="#">View invoice</a>';
					
					var awaitingButton = '<a class="button tips fy-awaiting-button" data-invoice="'+obj.CrearComprobanteFullResult.IdComprobante+'" href="#">Awaiting invoice</a>';
					
					$.when(td.append(awaitingButton)).then(function(){
						
						
						$(".fy-view-invoice-button").click(viewInvoice);
						
						esto.remove();
						
						jQuery('<div class="notice notice-success is-dismissible"><p><strong>'+obj.CrearComprobanteFullResult.Mensaje+'</strong></p></div>').insertAfter( jQuery('.wp-header-end') );
						
					});
					
					
					}else{
						alert(obj.CrearComprobanteFullResult.Mensaje);
						jQuery('<div class="notice notice-warning is-dismissible"><p><strong>'+obj.CrearComprobanteFullResult.Mensaje+'</strong></p></div>').insertAfter( jQuery('.wp-header-end') );
						esto.css('pointer-events', 'none').css('cursor', 'default');
					}
					
				}else{
					
					if(obj.CrearComprobanteSinImpuestosResult.Estado=="OK"){
					
					
					var viewButton = '<a class="button tips fy-view-invoice-button" data-invoice="'+obj.CrearComprobanteSinImpuestosResult.IdComprobante+'" href="#">View invoice</a>';
					
					var awaitingButton = '<a class="button tips fy-awaiting-button" data-invoice="'+obj.CrearComprobanteSinImpuestosResult.IdComprobante+'" href="#">Awaiting invoice</a>';
					
					$.when(td.append(awaitingButton)).then(function(){
						
						
						$(".fy-view-invoice-button").click(viewInvoice);
						
						esto.remove();
						
						jQuery('<div class="notice notice-success is-dismissible"><p><strong>'+obj.CrearComprobanteSinImpuestosResult.Mensaje+'</strong></p></div>').insertAfter( jQuery('.wp-header-end') );
						
					});
					
					
					}else{
						alert(obj.CrearComprobanteSinImpuestosResult.Mensaje);
						jQuery('<div class="notice notice-warning is-dismissible"><p><strong>'+obj.CrearComprobanteSinImpuestosResult.Mensaje+'</strong></p></div>').insertAfter( jQuery('.wp-header-end') );
						esto.css('pointer-events', 'none').css('cursor', 'default');
					}
					
				}
				
			});
			
		});
		
		jQuery(".fy-view-invoice-button").click(viewInvoice);
		
	 });
	 
	

})( jQuery );

function viewInvoice(){
	
	
		if(jQuery("#post_ID").length>0){
			
			var order_id = jQuery("#post_ID").val();
			
		}else{
		
			var order_aux = jQuery(this).closest('tr').attr('id').split('-');
				
			var order_id = order_aux[1];
		
		}
		
		var data = {
				
				action: 'woo_facturante_view_ajax_request',
				
				order: order_id
			
		}
		
		console.log(data);
		
		jQuery.ajax({ 
			type: "POST",
			url: ajaxurl,
			async:  false,
			data: data,
			
		}).then(
		
			function( data ) {
			
				var obj = JSON.parse(data);
				
				//Verificar los estados en EstadoComprobante
				
				/*
				
				8: ESPERANDO CAE: indica que el comprobante está esperando para ser validado en AFIP. (Estado temporal)
				7: COMUNICACIÓN CON AFIP: Se está realizando la comunicación con el WS de AFIP para obtener el CAE. (Estado temporal)
				9: TIMEOUT AFIP: AFIP no respondió a tiempo la solicitud y se está resolviendo la situación. (Estado temporal)
				2: ENVIANDO: el comprobante ya obtuvo el CAE y está siendo enviado al cliente. (Estado temporal)
				4: PROCESADO: se realizó el envío al cliente con éxito y está esperando que el cliente lo abra. (Estado Final)
				6: ERROR EN COMPROBANTE: indica que el comprobante NO fue validado por AFIP. De modo que deberá evaluar el error para rehacer el comprobante salvando el mismo. (Estado Final)
				10: ESPERANDO RESPUESTA AFIP: indica que ya se solicitó la validación al WS de AFIP y se está esperando la respuesta. (Estado temporal)

				*/
				
				if(obj.DetalleComprobanteResult.Estado=="ERROR"){
					
					alert(obj.DetalleComprobanteResult.Mensaje);
					
					return false;
					
				}else{
					
					if(obj.DetalleComprobanteResult.Comprobante.EstadoComprobante==4){
					
						jQuery.when(
								true					
						).done(function(){
							
							window.open(obj.DetalleComprobanteResult.Comprobante.URLPDF);
							
						});
					
					}else{
						
						alert(obj.DetalleComprobanteResult.Comprobante.EstadoAnalitico);
						
					}
				
					
				}
				
				
			
			
			}
		
		
		);
}

function isNumberKey(evt){
    var charCode = (evt.which) ? evt.which : event.keyCode
    if (charCode > 31 && (charCode < 48 || charCode > 57))
        return false;
    return true;
}
