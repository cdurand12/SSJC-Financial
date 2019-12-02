markowitz <- function(datax,columns){
  library(Ecdat)
  library(quadprog)
  R = 100*datax[,columns]
  mean_vect = apply(R,2,mean)
  cov_mat = cov(R)
  sd_vect = sqrt(diag(cov_mat))

  Amat = cbind(rep(1,3),mean_vect)
  muP = seq(.05,.14,length=300)
  sdP = muP
  weights = matrix(0,nrow=300,ncol=3)

  for (i in 1:length(muP))
  {
    bvec = c(1,muP[i])
    result = solve.QP(Dmat=2*cov_mat,dvec=rep(0,3),Amat=Amat,bvec=bvec,meq=2)
    sdP[i] = sqrt(result$value)
    weights[i,] = result$solution
  }

  plot(sdP,muP,type="l",xlim=c(0,2.5),ylim=c(0,.15),lty=3)

  mufree = 1.3/253
  points(0,mufree,cex=4,pch="*")
  sharpe = (muP-mufree)/sdP
  ind = (sharpe == max(sharpe))
  options(digits=3)
  weights[ind,]
  lines(c(0,2),mufree+c(0,2)*(muP[ind]-mufree)/sdP[ind],lwd=4,lty=2)
  points(sdP[ind],muP[ind],cex=4,pch="*")
  ind2 = (sdP == min(sdP))
  points(sdP[ind2],muP[ind2],cex=2,pch="+")
  ind3 = (muP > muP[ind])
  lines(sdP[ind3],muP[ind3],type="l",xlim=c(0,.25),ylim=c(0,.3),lwd=2)
  i = 1
  while (length(columns) >= i){
      text(sd_vect[i],mean_vect[i],names(datax[1,(columns)[i]]),cex=1.5)
      i = i+1
  }
}