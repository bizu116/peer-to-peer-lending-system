package capstone.p2plend.entity;

import javax.persistence.CascadeType;
import javax.persistence.Column;
import javax.persistence.Entity;
import javax.persistence.FetchType;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;
import javax.persistence.JoinColumn;
import javax.persistence.ManyToOne;
import javax.persistence.OneToOne;
import javax.persistence.Table;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;

@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(value = { "hibernateLazyInitializer", "handler" })
@Entity
@Table(name = "Request")
public class Request {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	@Column(name = "id")
	private Integer id;

	@Column
	private Long amount;

	@Column
	private Long borrowDate;

	@Column
	private Float interestRate;

	@Column
	private Long createDate;

	@Column
	private String status;

	@JsonIgnoreProperties(value = { "borrowRequest", "lendRequest" })
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "borrower_id")
	private User borrower;

	@JsonIgnoreProperties(value = { "borrowRequest", "lendRequest" })
	@ManyToOne(fetch = FetchType.LAZY)
	@JoinColumn(name = "lender_id")
	private User lender;

	@JsonIgnoreProperties(value = { "request" })
	@OneToOne(mappedBy = "request", cascade = CascadeType.ALL, fetch = FetchType.LAZY)
	private Deal deal;

	public Request() {
	}

	public Integer getId() {
		return id;
	}

	public void setId(Integer id) {
		this.id = id;
	}

	public Long getAmount() {
		return amount;
	}

	public void setAmount(Long amount) {
		this.amount = amount;
	}

	public Long getBorrowDate() {
		return borrowDate;
	}

	public void setBorrowDate(Long borrowDate) {
		this.borrowDate = borrowDate;
	}

	public Float getInterestRate() {
		return interestRate;
	}

	public void setInterestRate(Float interestRate) {
		this.interestRate = interestRate;
	}

	public Long getCreateDate() {
		return createDate;
	}

	public void setCreateDate(Long createDate) {
		this.createDate = createDate;
	}

	public String getStatus() {
		return status;
	}

	public void setStatus(String status) {
		this.status = status;
	}

	public User getBorrower() {
		return borrower;
	}

	public void setBorrower(User borrower) {
		this.borrower = borrower;
	}

	public User getLender() {
		return lender;
	}

	public void setLender(User lender) {
		this.lender = lender;
	}

	public Deal getDeal() {
		return deal;
	}

	public void setDeal(Deal deal) {
		this.deal = deal;
	}

}
