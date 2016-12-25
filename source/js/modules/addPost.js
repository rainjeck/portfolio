(function(){

	var addPost = {

		doit: function(){
			this.listeners();
		},

		listeners: function() {
			$('#addPost').on('submit', addPost.addPostInBlog);
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
					data: dataForm
				})
				.done(function() {
					console.log("success");
				})
				.fail(function() {
					console.log("error");
				})
				.always(function() {
					console.log("complete");
				});

			} else {
				console.log('empty');
			}

		}

	}

	addPost.doit();

}());