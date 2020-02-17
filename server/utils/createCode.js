module.exports = function() {
    let code = ''
    let codeLength = 4
    var selectedChar = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9']
    // 'A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'
    for(let i = 0; i < codeLength; i++) {
        var charIndex = Math.floor(Math.random()*10)
        code = code + selectedChar[charIndex]
    }
    return code
}