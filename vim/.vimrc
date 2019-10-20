" turn on syntax hightlighting by default
syntax on

" tab behaviour
set tabstop=2
set shiftwidth=0
set expandtab
set smarttab

" include ruler
set number

" strip trailing white space on save
function! <SID>StripTrailingWhitespaces()
    let l = line(".")
    let c = col(".")
    %s/\s\+$//e
    call cursor(l, c)
endfun

autocmd BufWritePre * :call <SID>StripTrailingWhitespaces()

" set colour scheme
colorscheme dracula
