(function(){

	var addPost = {

		doit: function(){
			this.listeners();
		},

		listeners: function() {
			$('#addPost').on('submit', addPost.addPostInBlog);
			$('#deletePost').on('submit', addPost.deletePost);
			addPost.showPosts();
			$('#admDoneBtn').on('click', addPost.closeDoneWin);
		},

		closeDoneWin: function (e) {
			e.preventDefault();
			var $this = $(this),
				winWrap = $this.closest('.admpanel__done__wrapper');
			winWrap.hide();
			addPost.showPosts();
		},

		showPosts: function(){
			$.get('/showpost', function(data) {
				$('#posts').empty().append(data);
			});
		},

		addPostInBlog: function(e){
			e.preventDefault();
			var form = $(this),
				inputs = $(this).find('input').val();
			if (inputs.length > 0) {
				var dataForm = $(this).serializeArray();
				$.ajax({
					url: '/savepost',
					type: 'POST',
					dataType: 'json',
					data: dataForm,
					success: function () {
						var wWidth = $(window).width(),
							wHeight = $(window).height(),
							wScroll = $(window).scrollTop();

						$('.admpanel__done__text').text('Пост добавлен');
						$('.admpanel__done__wrapper').css({width: wWidth, height: wHeight, top: wScroll}).fadeIn();
						form[0].reset();
					}
				});

			} else {
				console.log('empty');
			}

		}, // add post

		deletePost: function (e) {
			e.preventDefault();
			var form = $(this),
				inputs = $(this).find('input').val();

			if (inputs.length > 0) {
				var dataForm = $(this).serializeArray();
				$.ajax({
					url: '/delete',
					type: 'POST',
					dataType: 'json',
					data: dataForm,
					success: function (data) {
						var wWidth = $(window).width(),
							wHeight = $(window).height(),
							wScroll = $(window).scrollTop();

						$('.admpanel__done__text').text('Пост удален');
						$('.admpanel__done__wrapper').css({width: wWidth, height: wHeight, top: wScroll}).fadeIn();
						form[0].reset();
						console.log('delete');
					}
				});
			} else {
				console.log('empty');
			}
		}

	}

	addPost.doit();

}());