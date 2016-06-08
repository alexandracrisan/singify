(function() {
	'use strict';

	angular
		.module('app')
		.controller('PresentationCtrl', PresentationCtrl);

	PresentationCtrl.$inject = ['$state', '$scope', 'SessionService', 'PresentationService', 'UtilService'];

	function PresentationCtrl($state, $scope, SessionService, PresentationService, UtilService) {

		this.loggedUser = SessionService.getCurrentUser();
		this.base = UtilService.baseUrl + '/dashboard';
		this.MIMETYPE_PDF = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];

		this.logout = function() {
			SessionService.removeCurrentUser();
			PresentationService.logout().then(
				function(response) {

					window.location.href =  UtilService.baseUrl + '/';
				},
				function(error) {
					console.log(error);
				}
			)
		};

		//$('#upload-input').fileinput({
		//	//uploadUrl: this.base,
		//	//uploadAsync: false,
		//	previewFileIcon: '<i class="fa fa-file"></i>',
		//	previewFileIconSettings: {
		//		'doc': '<i class="fa fa-file-word-o text-primary"></i>',
		//		'xls': '<i class="fa fa-file-excel-o text-success"></i>',
		//		'ppt': '<i class="fa fa-file-powerpoint-o text-danger"></i>',
		//		'jpg': '<i class="fa fa-file-photo-o text-warning"></i>',
		//		'pdf': '<i class="fa fa-file-pdf-o text-danger"></i>',
		//		'zip': '<i class="fa fa-file-archive-o text-muted"></i>',
		//		'htm': '<i class="fa fa-file-code-o text-info"></i>',
		//		'txt': '<i class="fa fa-file-text-o text-info"></i>',
		//		'mov': '<i class="fa fa-file-movie-o text-warning"></i>',
		//		'mp3': '<i class="fa fa-file-audio-o text-warning"></i>',
		//	},
		//	previewFileExtSettings: {
		//		'doc': function(ext) {
		//			return ext.match(/(doc|docx)$/i);
		//		},
		//		'xls': function(ext) {
		//			return ext.match(/(xls|xlsx)$/i);
		//		},
		//		'ppt': function(ext) {
		//			return ext.match(/(ppt|pptx)$/i);
		//		},
		//		'zip': function(ext) {
		//			return ext.match(/(zip|rar|tar|gzip|gz|7z)$/i);
		//		},
		//		'htm': function(ext) {
		//			return ext.match(/(php|js|css|htm|html)$/i);
		//		},
		//		'txt': function(ext) {
		//			return ext.match(/(txt|ini|md)$/i);
		//		},
		//		'mov': function(ext) {
		//			return ext.match(/(avi|mpg|mkv|mov|mp4|3gp|webm|wmv)$/i);
		//		},
		//		'mp3': function(ext) {
		//			return ext.match(/(mp3|wav)$/i);
		//		},
		//	}
		//});
var self = this;

		function sendFileToServer(formData,status)
		{
			var uploadURL = self.base;
			var extraData ={}; //Extra Data.
			var jqXHR=$.ajax({
				xhr: function() {
					var xhrobj = $.ajaxSettings.xhr();
					if (xhrobj.upload) {
						xhrobj.upload.addEventListener('progress', function(event) {
							var percent = 0;
							var position = event.loaded || event.position;
							var total = event.total;
							if (event.lengthComputable) {
								percent = Math.ceil(position / total * 100);
							}
							//Set progress
							status.setProgress(percent);
						}, false);
					}
					return xhrobj;
				},
				url: uploadURL,
				type: "POST",
				contentType:false,
				processData: false,
				cache: false,
				data: formData,
				success: function(data){
					status.setProgress(100);

					$("#status1").append("File upload Done<br>");
				}
			});

			status.setAbort(jqXHR);
		}

		var rowCount=0;
		function createStatusbar(obj)
		{
			rowCount++;
			var row="odd";
			if(rowCount %2 ==0) row ="even";
			this.statusbar = $("<div class='statusbar "+row+"'></div>");
			//this.filename = $("<div class='filename'></div>").appendTo(this.statusbar);
			this.size = $("<div class='filesize'></div>").appendTo(this.statusbar);
			this.progressBar = $("<div class='progressBar'><div></div></div>").appendTo(this.statusbar);
			this.abort = $("<div class='abort'>Abort</div>").appendTo(this.statusbar);
			obj.after(this.statusbar);

			this.setFileNameSize = function(name,size)
			{
				var sizeStr="";
				var sizeKB = size/1024;
				if(parseInt(sizeKB) > 1024)
				{
					var sizeMB = sizeKB/1024;
					sizeStr = sizeMB.toFixed(2)+" MB";
				}
				else
				{
					sizeStr = sizeKB.toFixed(2)+" KB";
				}

				//this.filename.html(name);
				this.size.html(sizeStr);
			}
			this.setProgress = function(progress)
			{
				var progressBarWidth =progress*this.progressBar.width()/ 100;
				this.progressBar.find('div').animate({ width: progressBarWidth }, 10).html(progress + "% ");
				if(parseInt(progress) >= 100)
				{
					this.abort.hide();
				}
			}
			this.setAbort = function(jqxhr)
			{
				var sb = this.statusbar;
				this.abort.click(function()
				{
					jqxhr.abort();
					sb.hide();
				});
			}
		}
		function handleFileUpload(files,obj)
		{
			for (var i = 0; i < files.length; i++)
			{
				var fd = new FormData();
				fd.append('file', files[i]);
console.log(files[i].type);
				//if(self.MIMETYPE_PDF.indexOf(files[i].type) > -1) {
				//	console.log('its pdf')
				//}
				var status = new createStatusbar(obj); //Using this we can set progress.
				status.setFileNameSize(files[i].name,files[i].size);
				sendFileToServer(fd,status);

			}
		}
		$(document).ready(function() {
			var obj = $("#dragandrophandler");
			obj.on('dragenter', function (e) {
				e.stopPropagation();
				e.preventDefault();
				var styles = {
					'background-color': '#00BD9B',
					'color': '#5f6260'
				};
				$(this).css(styles);
			});

			obj.on('dragover', function (e) {
				e.stopPropagation();
				e.preventDefault();
			});

			var styles = {
				'color': '#92AAB0',
				'background-color': 'white'
			};

			obj.on('drop', function (e) {

				$(this).css(styles);
				e.preventDefault();
				var files = e.originalEvent.dataTransfer.files;

				//We need to send dropped files to Server
				handleFileUpload(files,obj);
			});

			$(document).on('dragenter', function (e) {
				e.stopPropagation();
				e.preventDefault();
			});

			$(document).on('dragover', function (e) {
				e.stopPropagation();
				e.preventDefault();
				obj.css(styles);
			});

			$(document).on('drop', function (e) {
				e.stopPropagation();
				e.preventDefault();
			});
		});

	}
})();
